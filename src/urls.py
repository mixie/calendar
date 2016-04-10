from django.conf.urls import url
from .views import EventViewSet, GroupViewSet, CategoryGroupViewSet, CategoryViewSet


urlpatterns = [
    url(r'^events/', EventViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^events/(?P<id>[0-9]+)/', EventViewSet.as_view({'get': 'retrieve'})),
    url(r'^groups/', GroupViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^groups/(?P<id>[0-9]+)/', EventViewSet.as_view({'get': 'retrieve'})),
    url(r'^categorys/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^categorys/(?P<id>[0-9]+)/', CategoryViewSet.as_view({'get': 'retrieve'})),
    url(r'^categorygroups/', CategoryGroupViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^categorygroups/(?P<id>[0-9]+)/', CategoryGroupViewSet.as_view({'get': 'retrieve'})),
]
