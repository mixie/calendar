from django.conf.urls import url
from .views import EventViewSet, GroupViewSet, CategoryGroupViewSet, CategoryViewSet, IcsCalendarViewSet, EventDetailViewSet
from . import views

urlpatterns = [
    url(r'^events/$', EventViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^events/(?P<pk>[0-9]+)/$', EventDetailViewSet.as_view()),
    url(r'^groups/$', GroupViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^groups/(?P<pk>[0-9]+)/$', GroupViewSet.as_view({'get': 'retrieve'})),
    url(r'^categories/$', CategoryViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^categories/(?P<pk>[0-9]+)/$', CategoryViewSet.as_view({'get': 'retrieve'})),
    url(r'^categorygroups/$', CategoryGroupViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^categorygroups/(?P<pk>[0-9]+)/$', CategoryGroupViewSet.as_view({'get': 'retrieve'})),
    url(r'^icscalendars/$', IcsCalendarViewSet.as_view({'get': 'list', 'post': 'create'})),
    url(r'^icscalendars/(?P<pk>[0-9]+)/$', IcsCalendarViewSet.as_view({'get': 'retrieve'})),
    url(r'^ics/(?P<gen>[a-zA-Z0-9]+).ics/$', views.ics, name='ics'),
    url(r'^onlyPublic/$', views.onlyPublic, name='onlyPublic'),

]
