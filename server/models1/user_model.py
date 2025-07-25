from mongoengine import Document, StringField, ListField, EnumField, DateTimeField
import datetime

class User(Document):
    meta = {'collection': 'newuser'}
    name = StringField(required=True, trim=True)
    email = StringField(required=True, unique=True, trim=True)
    password = StringField(required=True)
    role = EnumField(
        choices=("USER", "ADMIN", "ReadOnly"),
        required=True,
        default="USER"
    )
    scheduled_tasks = ListField(StringField(choices=taskNames))
    created_on = DateTimeField(default=datetime.datetime.utcnow)
    last_modified = DateTimeField(default=datetime.datetime.utcnow)

    def save(self, *args, **kwargs):
        self.last_modified = datetime.datetime.utcnow()
        super(User, self).save(*args, **kwargs)
