from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("submissions", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="submission",
            name="test_results",
            field=models.JSONField(blank=True, null=True),
        ),
    ]
