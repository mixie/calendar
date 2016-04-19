# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-19 21:38
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('trojsten_calendar', '0011_auto_20160419_2134'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='categories',
            field=models.ManyToManyField(blank=True, null=True, to='trojsten_calendar.Category'),
        ),
        migrations.AlterField(
            model_name='event',
            name='end',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='groups',
            field=models.ManyToManyField(blank=True, null=True, to='trojsten_calendar.Group'),
        ),
    ]