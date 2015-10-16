<?php

// Change charset on head
function edi_html_head_alter(&$head_elements) {
  $head_elements['system_meta_content_type']['#attributes'] = array(
    'charset' => 'utf-8'
  );
}

// Disable som system CSS
function edi_css_alter(&$css) {
  unset($css[drupal_get_path('module','system').'/system.menus.css']);
}

// Upgrade default jQuery
function edi_js_alter(&$javascript) {
  $jquery_path = drupal_get_path('theme', 'edi') . '/vendor/jquery/jquery.js';
  $javascript[$jquery_path] = $javascript['misc/jquery.js'];
  $javascript[$jquery_path]['version'] = '1.8.3';
  $javascript[$jquery_path]['data'] = $jquery_path;
  unset($javascript['misc/jquery.js']);
}

// Modify breadcrumbs
function edi_breadcrumb($variables) {
    $breadcrumb = $variables['breadcrumb'];
    if (!empty($breadcrumb))
    {
        $crumbs = implode(' &gt; ', $breadcrumb);
        //$crumbs = preg_replace("/Home/", "Inicio", $crumbs);
        $crumbs .= ' &gt; ' . drupal_get_title();
        return $crumbs;
    }
}

?>
