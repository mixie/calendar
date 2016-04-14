from django.conf.urls import url
from .views import EventViewSet, GroupViewSet, CategoryGroupViewSet, CategoryViewSet


urlpatterns = [
    url(r'^events/$', EventViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^events/(?P<pk>[0-9]+)/$', EventViewSet.as_view({'get': 'retrieve'})),
    url(r'^groups/$', GroupViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^groups/(?P<pk>[0-9]+)/$', GroupViewSet.as_view({'get': 'retrieve'})),
    url(r'^categories/$', CategoryViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^categories/(?P<pk>[0-9]+)/$', CategoryViewSet.as_view({'get': 'retrieve'})),
    url(r'^categorygroups/$', CategoryGroupViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^categorygroups/(?P<pk>[0-9]+)/$', CategoryGroupViewSet.as_view({'get': 'retrieve'})),
]
