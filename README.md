# WTP Coffee — Shopify storefront

The Shopify theme source for WTP Coffee, customized from Shopify Dawn 15.4.1. It includes the storefront layout, product and collection pages, brand story, locations, events, and booking inquiry pages.

This is a Shopify Online Store 2.0 theme built with Liquid, JSON templates, CSS, and JavaScript. Shopify renders the storefront; this repository is not a standalone application or a GitHub Pages site.

## Explore the source

| Directory | Contents |
| --- | --- |
| `layout/` | Shared storefront and password-page layouts |
| `sections/` | Theme sections, including custom `wtp-*` sections and booking pages |
| `snippets/` | Reusable Liquid components |
| `templates/` | Product, collection, blog, customer, and custom page templates |
| `assets/` | Stylesheets, JavaScript, and bundled icons |
| `config/` | Theme settings definitions and storefront configuration |
| `locales/` | Storefront and theme-editor translations |

Start with `layout/theme.liquid`, `templates/index.json`, and the `wtp-*` sections to follow the WTP customizations.

## Preview on Shopify

You need Git, a supported Node.js release, [Shopify CLI](https://shopify.dev/docs/storefronts/themes/tools/cli), and access to a Shopify store for theme development.

```sh
git clone https://github.com/gabespineli/wtp-coffee-shopify.git
cd wtp-coffee-shopify
npm install -g @shopify/cli@3.93.2
shopify theme dev --store your-development-store.myshopify.com
```

Follow the CLI sign-in prompts. Use a development store or development theme when testing changes. There is no npm build step for the theme assets in this repository.

The repository contains theme code and configuration, not a complete copy of the Shopify store. Products, collections, menus, pages, blog posts, metafields, uploaded images, and app configuration are managed in Shopify. References such as `shopify://shop_images/...` need corresponding assets on the preview store. Custom page templates must be assigned to pages in Shopify. Booking sections provide storefront inquiry interfaces; check their forms and store setup before using them for real inquiries.

## Check changes

```sh
shopify theme check --fail-level error
```

GitHub Actions runs the same check on pushes and pull requests. Preview affected pages in Shopify and check mobile layouts, navigation, product selection, cart behavior, and forms before publishing. Static checks do not verify those store-dependent interactions.

## Typography and assets

The commercial Grava font is excluded from this public source. Headings use the font selected in Shopify's theme settings. Any privately licensed font must be supplied separately by someone with the appropriate rights and must not be committed here.

WTP Coffee branding, copy, imagery, and third-party assets retain their respective ownership. Making this source viewable does not grant permission to reuse those assets or represent another site as WTP Coffee.

## Attribution and reuse

The theme is based on [Shopify Dawn](https://github.com/Shopify/dawn). The upstream license is preserved in [LICENSE.md](LICENSE.md); it includes Shopify-specific use and distribution conditions and is not the standard MIT license. No additional license is granted here for WTP-specific original material.

## Contributing

Keep changes focused and open a pull request with a description, Theme Check results, and screenshots for visual changes. Do not commit access tokens, `.env` files, local Shopify CLI state, customer data, or licensed font binaries. Report security concerns privately to the repository owner rather than posting credentials or personal data in an issue.
