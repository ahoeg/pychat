from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls.static import static

admin.autodiscover()
urlpatterns = patterns(
	'',
	url(r'^admin/', include(admin.site.urls)),
	url(r'^home$', 'story.views.home'),
	url(r'^$', 'story.views.home'),  # url(r'^login$', 'story.views.login'),
	url(r'^logout$', 'story.views.logout'),
	url(r'^auth$', 'story.views.auth'),
	url(r'^register$', 'story.views.register'),
	url(r'^alert$', 'story.views.shout'),
	url(r'^confirm_email$', 'story.views.confirm_email'),
	# story/register.js uses link below
	url(r'^validate_user$', 'story.views.validate_user'),
	url(r'^validate_email$', 'story.views.validate_email'),
	url(r'^get_messages$', 'story.views.get_messages'),
)
