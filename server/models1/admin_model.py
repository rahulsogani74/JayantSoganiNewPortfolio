from mongoengine import Document, StringField, DateTimeField
import datetime

class Admin(Document):
    meta = {'collection': 'admin'}
    name = StringField(required=True, trim=True)
    email = StringField(required=True, unique=True, trim=True)
    created_on = DateTimeField(default=datetime.datetime.utcnow)
    last_modified = DateTimeField(default=datetime.datetime.utcnow)

    def save(self, *args, **kwargs):
        self.last_modified = datetime.datetime.utcnow()
        super(Admin, self).save(*args, **kwargs)
