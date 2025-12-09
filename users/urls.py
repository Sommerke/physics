from django.urls import path
from .views import (
    register_view, login_view, asosiy_view, 
    admin_dashboard_view, delete_user, update_user, 
    test_yuborish, asosiy_nazariy_view, 
    asosiy_amaliy_view, asosiy_video_view, 
)
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),

    path('asosiy/', asosiy_view, name='asosiy'),  # bu faqat redirect qiladi
    path('asosiy/nazariy/', asosiy_nazariy_view, name='asosiy_nazariy'),
    path('asosiy/amaliy/', asosiy_amaliy_view, name='asosiy_amaliy'),
    path('asosiy/video/', asosiy_video_view, name='asosiy_video'),

    path('admin-panel/', admin_dashboard_view, name='admin_dashboard'),
    path('admin-panel/delete/<int:user_id>/', delete_user, name='delete_user'),
    path('admin-panel/update/<int:user_id>/', update_user, name='update_user'),

    path('test/<int:raqam>/', test_yuborish, name='test_yuborish'),
   

]
