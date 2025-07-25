from mongoengine import Document, StringField, DictField, DateTimeField
import datetime

class SideNavs(Document):
    meta = {'collection': 'sidenavs'}
    email = StringField(required=True, trim=True)
    side_nav_obj = DictField(required=True)
    created_on = DateTimeField(default=datetime.datetime.utcnow)
    last_modified = DateTimeField(default=datetime.datetime.utcnow)

    def save(self, *args, **kwargs):
        self.last_modified = datetime.datetime.utcnow()
        super(SideNavs, self).save(*args, **kwargs)
