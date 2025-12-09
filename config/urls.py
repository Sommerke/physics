from django.contrib import admin
from django.urls import path

from django.contrib import admin
from django.urls import path, include
from users import views as user_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('', include('users.urls')), 
    path('quiz/', include('quiz.urls')),
    path('admin-panel/', user_views.admin_dashboard_view, name='admin_dashboard'),
    
]