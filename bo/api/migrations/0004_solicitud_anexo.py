# Generated by Django 3.0.5 on 2020-06-07 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_delete_cargogrupo'),
    ]

    operations = [
        migrations.AddField(
            model_name='solicitud',
            name='anexo',
            field=models.TextField(blank=True),
        ),
    ]