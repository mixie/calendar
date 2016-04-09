from django.conf.urls import url
from .views import EventViewSet


urlpatterns = [
    url(r'^events/', EventViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^events/(?P<id>[0-9]+)/', EventViewSet.as_view({'get': 'retrieve'})),
]
