# Generated by Django 3.0.5 on 2020-05-01 02:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0010_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='stock',
            name='location',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='stock_location', to='inventory.Location'),
            preserve_default=False,
        ),
    ]
