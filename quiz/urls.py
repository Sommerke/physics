from django.urls import path
from . import views
from .views import amaliy_1_interaktiv_view

urlpatterns = [
    path('test/<int:maruza_id>/', views.maruza_test_view, name='maruza_test'),
    path('natija/<int:maruza_id>/', views.natija_view, name='natija'),
    path('add/', views.add_savol, name='add_savol'),
    path('amaliy/1/interaktiv/', amaliy_1_interaktiv_view, name='amaliy_1_interaktiv'),
    path('edit/<int:maruza_id>/', views.edit_savollar, name='edit_savollar'),
     path("results/", views.results_view, name="results"),
]
