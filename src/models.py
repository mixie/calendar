from __future__ import unicode_literals

from django.db import models

from datetime import datetime

from django.utils import timezone


class Group(models.Model):
    title = models.CharField(max_length=300,  default="")

    def __str__(self):
        return self.title


class CategoryGroup(models.Model):
    title = models.CharField(max_length=300,  default="")

    def __str__(self):
        return self.title


class Category(models.Model):
    title = models.CharField(max_length=300, default="")
    category_group = models.ForeignKey(CategoryGroup)

    def __str__(self):
        return self.title


class Event(models.Model):
    title = models.CharField(max_length=300)
    start = models.DateTimeField(default=timezone.now)
    end = models.DateTimeField(default=timezone.now)
    public = models.BooleanField(default=True)
    allDay = models.BooleanField(default=True)
    categories = models.ManyToManyField(Category)
    groups = models.ManyToManyField(Group)

    def __str__(self):
        return self.title