from django.conf.urls import url
from . import views


urlpatterns = [
        url(r'^$', views.calendar, name='calendar'),
        url(r'^register/$', views.register, name='register'),
        url(r'^login/$', views.user_login, name='login'),
]
