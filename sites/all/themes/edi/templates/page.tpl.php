<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page.
 *
 * The doctype, html, head and body tags are not in this template. Instead they
 * can be found in the html.tpl.php template in this directory.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $directory: The directory the template is located in, e.g. modules/system
 *   or themes/bartik.
 * - $is_front: TRUE if the current page is the front page.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or
 *   prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 *
 * Navigation:
 * - $main_menu (array): An array containing the Main menu links for the
 *   site, if they have been configured.
 * - $secondary_menu (array): An array containing the Secondary menu links for
 *   the site, if they have been configured.
 * - $breadcrumb: The breadcrumb trail for the current page.
 *
 * Page content (in order of occurrence in the default page.tpl.php):
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title: The page title, for use in the actual HTML content.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 * - $messages: HTML for status and error messages. Should be displayed
 *   prominently.
 * - $tabs (array): Tabs linking to any sub-pages beneath the current page
 *   (e.g., the view and edit tabs when displaying a node).
 * - $action_links (array): Actions local to the page, such as 'Add menu' on the
 *   menu administration interface.
 * - $feed_icons: A string of all feed icons for the current page.
 * - $node: The node object, if there is an automatically-loaded node
 *   associated with the page, and the node ID is the second argument
 *   in the page's path (e.g. node/12345 and node/12345/revisions, but not
 *   comment/reply/12345).
 *
 * Regions:
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['sidebar_second']: Items for the second sidebar.
 * - $page['header']: Items for the header region.
 * - $page['footer']: Items for the footer region.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see html.tpl.php
 *
 * @ingroup themeable
 */
?>
  <header class="layout-header">
    <?php if ($page['top']): ?>
    <div class="layout-header-top">
      <div class="row">
        <div class="grid-9">
          <?php print render($page['top']); ?>
        </div>

        <div class="grid-3">
          <div class="google-translator">
             <div id="google_translate_element"></div><script type="text/javascript">
             function googleTranslateElementInit() {
               new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,es,fr', layout: google.translate.TranslateElement.FloatPosition.TOP_RIGHT, autoDisplay: false}, 'google_translate_element');
             }
             </script><script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
          </div>
        </div>
      </div>
    </div>
    <?php endif; ?>

    <div class="layout-header-bottom">
      <button class="open-submenu"></button>
      <div class="row">
        <div class="grid-3 medium-grid-12">
          <div class="mod-brand">
              <?php if ($logo): ?>
                <a class="small-is-hidden" href="/" title="<?php print t('Home'); ?>" rel="home" id="logo">
                  <img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
                </a>
                <a class="md-is-hidden" href="/node/1705" title="<?php print t('Home'); ?>" rel="home" id="logo">
                  <img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
                </a>
              <?php endif; ?>

            <?php if ($site_name || $site_slogan): ?>
              <?php if ($site_name): ?>
                <h1>
                  <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home">
                    <?php print $site_name; ?>
                  </a>
                </h1>
              <?php endif; ?>

              <?php if ($site_slogan): ?>
                <div class="mod-brand-slogan"><?php print $site_slogan; ?></div>
              <?php endif; ?>
            <?php endif; ?>
          </div>
        </div>

        <div class="grid-9 medium-grid-12">
          <?php print render($page['header']); ?>
        </div>

        <?php if ($main_menu || $secondary_menu): ?>
            <nav class="mod-main-menu">
              <?php print theme('links__system_main_menu', array('links' => $main_menu, 'attributes' => array('id' => 'main-menu', 'class' => array('links', 'inline', 'clearfix')), 'heading' => t('Main menu'))); ?>
              <?php print theme('links__system_secondary_menu', array('links' => $secondary_menu, 'attributes' => array('id' => 'secondary-menu', 'class' => array('links', 'inline', 'clearfix')), 'heading' => t('Secondary menu'))); ?>
            </nav>
        <?php endif; ?>
      </div>
    </div>

    <div class="layout-tag-line">
      <div class="row">
        <div class="grid-12">
          <div id="tagLine">
            <p></p>
          </div>
        </div>
      </div>
    </div>
  </header>

  <section class="layout-main">

    <header class="layout-main-header">

      <div class="highlight-image"></div>

      <div class="row">
        <div class="grid-12">
          <div class="layout-breadcrumbs">

              <?php /* if ($breadcrumb): ?>
                <nav id="breadcrumbs" class="mod-breadcrumbs">
                  <?php print $breadcrumb; ?>
                </nav>
              <?php endif; */ ?>

              <?php if ($page['social_share']): ?>
                <div class="mod-social-share">
                  <?php print render($page['social_share']); ?>
                </div>
              <?php endif; ?>

              <?php if ($page['country-search']): ?>
                <div id="countryPageSearchView" class="mod-country-page-search">
                  <?php print render($page['country-search']); ?>
                </div>
              <?php endif; ?>

          </div>
        </div>
      </div>

      <?php if ($messages): ?>
        <div class="layout-messages">
          <div class="row">
            <div class="grid-12">
              <?php print $messages; ?>
            </div>
          </div>
        </div>
      <?php endif; ?>

      <?php if ($page['highlighted']): ?>
        <div class="layout-highlighted">
          <?php print render($page['highlighted']); ?>
        </div>
      <?php endif; ?>
    </header>

    <div class="layout-main-content">
      <?php print render($title_prefix); ?>
      <?php if ($title): ?><h1><?php print $title; ?></h1><?php endif; ?>
      <?php print render($title_suffix); ?>
      <?php if ($tabs): ?><div class="mod-main-content-tabs"><?php print render($tabs); ?></div><?php endif; ?>
      <?php print render($page['help']); ?>
      <?php if ($action_links): ?><ul class="mod-action-links"><?php print render($action_links); ?></ul><?php endif; ?>
      <?php print render($page['content']); ?>
    </div>

    <?php if ($page['sidebar_first']): ?>
      <aside class="layout-related-content">
        <div class="row">
          <div class="grid-12">
            <?php print render($page['sidebar_first']); ?>
          </div>
        </div>
      </aside>
    <?php endif; ?>

  </section> <!-- layout-main -->

  <footer class="layout-footer">
    <div class="mod-footer">
      <?php if ($page['sidebar_second']): ?>
        <div class="layout-footer-top">
          <aside class="layout-postscript">
            <div class="row">
              <div class="grid-12">
                <div class="mod-postscript">
                  <?php print render($page['sidebar_second']); ?>
                </div>
              </div>
            </div>
          </aside>
        </div>
      <?php endif; ?>

      <div class="layout-footer-bottom">
        <div class="row">
          <div class="grid-12">
            <?php print render($page['footer']); ?>
          </div>
        </div>
      </div>
    </div>
  </footer> <!-- layout-footer -->


