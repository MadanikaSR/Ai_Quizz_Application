from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count, Max, Min, Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Category, Quiz, Question, QuizAttempt, UserAnswer
from .serializers import (
    QuizSerializer, 
    QuizAttemptSerializer, 
    CategorySerializer, 
    QuestionWithAnswerSerializer,
    QuestionSerializer
)
from .ai_service import generate_quiz_questions

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'A user with that username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    if email and User.objects.filter(email=email).exists():
        return Response({'detail': 'A user with that email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    from django.contrib.auth import authenticate
    identifier = request.data.get('username') # Conceptually either username or email
    password = request.data.get('password')

    if not identifier or not password:
        return Response({'detail': 'Username/Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Try authenticating as username
    user = authenticate(username=identifier, password=password)

    # 2. If fails, try finding user by email and then authenticating by their username
    if not user and '@' in identifier:
        try:
            temp_user = User.objects.get(email=identifier)
            user = authenticate(username=temp_user.username, password=password)
        except User.DoesNotExist:
            pass

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
    else:
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email
    })

# AI Quiz Logic

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_quiz(request):
    topic = request.data.get('topic')
    difficulty = request.data.get('difficulty')
    num_questions = int(request.data.get('num_questions', 5))
    category_id = request.data.get('category_id')

    if not topic or not difficulty:
        return Response({'detail': 'Topic and difficulty are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 1. Call AI Service
        ai_questions = generate_quiz_questions(topic, difficulty, num_questions)

        # 2. Create Quiz Record
        category = Category.objects.filter(id=category_id).first() if category_id else None
        quiz = Quiz.objects.create(
            title=f"{difficulty.title()} Quiz on {topic}",
            topic=topic,
            difficulty=difficulty,
            category=category,
            creator=request.user,
            time_limit_minutes=num_questions * 2 # Roughly 2 mins per question default
        )

        # 3. Create Question Records
        for q_data in ai_questions:
            Question.objects.create(
                quiz=quiz,
                text=q_data['text'],
                option_a=q_data['option_a'],
                option_b=q_data['option_b'],
                option_c=q_data['option_c'],
                option_d=q_data['option_d'],
                correct_option=q_data['correct_option']
            )

        # 4. Return serialized quiz
        serializer = QuizSerializer(quiz)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.shortcuts import get_object_or_404

@api_view(['GET'])
@permission_classes([AllowAny]) # Anyone with the link can see the quiz
def get_quiz_by_uuid(request, share_uuid):
    quiz = get_object_or_404(Quiz, share_uuid=share_uuid)
    serializer = QuizSerializer(quiz)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz_attempt(request, share_uuid):
    quiz = get_object_or_404(Quiz, share_uuid=share_uuid)
    answers_data = request.data.get('answers', [])
    attempt_id = request.data.get('attempt_id')
    
    # Map questions for quick lookup
    questions = {q.id: q for q in quiz.questions.all()}
    
    score = 0
    correct_count = 0
    
    if attempt_id:
        attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
    else:
        attempt = QuizAttempt.objects.create(quiz=quiz, user=request.user)

    for ans in answers_data:
        question_id = ans.get('question_id')
        selected_option = ans.get('selected_option')
        
        question = questions.get(question_id)
        if question:
            is_correct = (selected_option == question.correct_option)
            if is_correct:
                correct_count += 1
                
            UserAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_option=selected_option,
                is_correct=is_correct
            )
            
    # Calculate results
    attempt.completed_at = timezone.now()
    duration = (attempt.completed_at - attempt.started_at).total_seconds()
    attempt.time_spent_seconds = int(duration)
    
    total_questions = len(questions)
    if total_questions > 0:
        attempt.accuracy_percentage = int((correct_count / total_questions) * 100)
        attempt.score = correct_count * 10 # 10 points per question for leaderboard
    
    attempt.save()
    
    serializer = QuizAttemptSerializer(attempt)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_quiz_attempt(request, share_uuid):
    quiz = get_object_or_404(Quiz, share_uuid=share_uuid)
    attempt = QuizAttempt.objects.create(quiz=quiz, user=request.user)
    return Response({"attempt_id": attempt.id}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def category_list_create(request):
    if request.method == 'GET':
        categories = Category.objects.filter(Q(created_by__isnull=True) | Q(created_by=request.user))
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        name = request.data.get('name')
        description = request.data.get('description', '')
        if not name:
            return Response({"detail": "Category name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        category = Category.objects.create(name=name, description=description, created_by=request.user)
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attempt_details(request, attempt_id):
    attempt = get_object_or_404(QuizAttempt, id=attempt_id)
    # Ensure a user only sees their own attempt, unless they are admin/creator (optional rule)
    if attempt.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)
        
    serializer = QuizAttemptSerializer(attempt)
    # Include the correct answers as well for review
    quiz = attempt.quiz
    quiz_serializer = QuizSerializer(quiz)
    
    # Hack to return correct answers since we excluded it from QuestionSerializer:
    questions_full = QuestionWithAnswerSerializer(quiz.questions.all(), many=True).data

    return Response({
        "attempt": serializer.data,
        "quiz": quiz_serializer.data,
        "questions_with_answers": questions_full
    })

from django.db.models import Avg, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_history(request):
    attempts = QuizAttempt.objects.filter(user=request.user, completed_at__isnull=False).order_by('-completed_at')
    serializer = QuizAttemptSerializer(attempts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_analytics(request):
    user = request.user
    attempts = QuizAttempt.objects.filter(user=user, completed_at__isnull=False)
    
    if not attempts.exists():
        return Response({
            "has_data": False,
            "message": "Start taking quizzes to see your analytics!"
        })

    total_quizzes = attempts.count()
    avg_accuracy = attempts.aggregate(Avg('accuracy_percentage'))['accuracy_percentage__avg'] or 0
    
    # Group by category
    category_stats = attempts.values('quiz__category__name') \
        .annotate(
            avg_score=Avg('score'),
            avg_accuracy=Avg('accuracy_percentage'),
            total_attempts=Count('id')
        ) \
        .order_by('-avg_accuracy')

    stats = []
    for s in category_stats:
        cat_name = s['quiz__category__name'] or "General"
        stats.append({
            "category": cat_name,
            "avg_accuracy": int(s['avg_accuracy']),
            "avg_score": int(s['avg_score']),
            "total_attempts": s['total_attempts']
        })

    # Strengths and Weaknesses
    strength = stats[0]['category'] if stats else None
    weakness = stats[-1]['category'] if len(stats) > 1 else None

    return Response({
        "has_data": True,
        "total_quizzes": total_quizzes,
        "overall_accuracy": int(avg_accuracy),
        "category_performance": stats,
        "insights": {
            "strength": strength,
            "weakness": weakness,
            "recommendation": f"Focus on {weakness} to improve your mastery!" if weakness else "Keep up the great work!"
        }
    })


