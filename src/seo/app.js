import {
  BreadcrumbJsonLd,
  DefaultSeo,
  SiteLinksSearchBoxJsonLd,
  SocialProfileJsonLd,
} from 'next-seo';

const AppSeo = () => {
  return (
    <>
      <DefaultSeo
        title='MakeMySong - Create Music songs using AI'
        description='Create Music songs using AI'
        additionalMetaTags={[
          {
            property: 'al:android:url',
            content: 'fantiger://',
          },
          {
            property: 'al:android:app_name',
            content: 'FanTV',
          },
          {
            property: 'al:android:package',
            content: 'com.fantv',
          },
        ]}
      />
    </>
  );
};

export default AppSeo;
