from rest_framework import serializers
from .models import User, Category, Quiz, Question, QuizAttempt, UserAnswer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CategorySerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    quiz_count = serializers.IntegerField(source='quiz_set.count', read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_by', 'quiz_count']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d']
        # Note: We purposely exclude correct_option so users can't see the answers

class QuestionWithAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'topic', 'difficulty', 'category', 'creator', 'created_at', 'share_uuid', 'time_limit_minutes', 'questions']

class UserAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text', read_only=True)
    correct_option = serializers.CharField(source='question.correct_option', read_only=True)
    
    class Meta:
        model = UserAnswer
        fields = ['id', 'question', 'question_text', 'selected_option', 'correct_option', 'is_correct']

class QuizAttemptSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_answers = UserAnswerSerializer(many=True, read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    quiz_category = serializers.CharField(source='quiz.category.name', read_only=True, default="Uncategorized")
    quiz_uuid = serializers.UUIDField(source='quiz.share_uuid', read_only=True)

    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'quiz', 'quiz_uuid', 'quiz_title', 'quiz_category', 'user', 
            'score', 'accuracy_percentage', 'time_spent_seconds', 
            'started_at', 'completed_at', 'user_answers'
        ]
