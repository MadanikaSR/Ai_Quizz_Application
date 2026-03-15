from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/user/', views.get_current_user, name='current-user'),
    path('quizzes/generate/', views.generate_quiz, name='generate-quiz'),
    path('quizzes/<uuid:share_uuid>/', views.get_quiz_by_uuid, name='get-quiz'),
    path('quizzes/<uuid:share_uuid>/start/', views.start_quiz_attempt, name='start-quiz'),
    path('quizzes/<uuid:share_uuid>/submit/', views.submit_quiz_attempt, name='submit-quiz'),
    path('attempts/<int:attempt_id>/', views.get_attempt_details, name='attempt-details'),
    path('categories/', views.category_list_create, name='categories'),
    path('analytics/', views.get_user_analytics, name='user-analytics'),
    path('history/', views.get_user_history, name='user-history'),
]
