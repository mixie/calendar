from __future__ import unicode_literals

from django.db import models

from datetime import datetime

from django.utils import timezone


class Group(models.Model):
    list_display = ('title')
    title = models.CharField(max_length=300,  default="")


class CategoryGroup(models.Model):
    list_display = ('title')
    title = models.CharField(max_length=300,  default="")


class Category(models.Model):
    list_display = ('title')
    title = models.CharField(max_length=300, default="")
    category_group = models.ForeignKey(CategoryGroup)


class Event(models.Model):
    list_display = ('title')
    title = models.CharField(max_length=300)
    fromdate = models.DateField(default=timezone.now)
    todate = models.DateField(default=timezone.now)
    public = models.BooleanField(default=True)
    wholeday = models.BooleanField(default=True)
    category = models.ForeignKey(Category)
    organized_by = models.ManyToManyField(Group)
