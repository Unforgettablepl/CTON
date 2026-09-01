// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { visit } from 'unist-util-visit';

import cloudflare from '@astrojs/cloudflare';

function rehypeHighlight() {
    return (/** @type {any} */ tree) => {
        visit(tree, (node) => {
            if (!node.children || !Array.isArray(node.children)) return;
            const newChildren = [];
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                if (child.type === 'text' && child.value === '==') {
                    const next = node.children[i + 1];
                    const afterNext = node.children[i + 2];
                    if (next && afterNext && afterNext.type === 'text' && afterNext.value === '==') {
                        newChildren.push({
                            type: 'element',
                            tagName: 'mark',
                            properties: { className: ['year-badge'] },
                            children: [next],
                        });
                        i += 2;
                        continue;
                    }
                }
                if (child.type === 'text' && child.value.includes('==')) {
                    const parts = child.value.split(/(==[^=\n]+==)/g);
                    if (parts.length > 1) {
                        for (const part of parts) {
                            if (part.startsWith('==') && part.endsWith('==')) {
                                newChildren.push({
                                    type: 'element',
                                    tagName: 'mark',
                                    properties: { className: ['year-badge'] },
                                    children: [{ type: 'text', value: part.slice(2, -2) }],
                                });
                            } else if (part) {
                                newChildren.push({ type: 'text', value: part });
                            }
                        }
                        continue;
                    }
                }
                newChildren.push(child);
            }
            node.children = newChildren;
        });
    };
}

// https://astro.build/config
export default defineConfig({
  markdown: {
      rehypePlugins: [rehypeHighlight],
	},

  integrations: [
      starlight({
          title: 'My Docs',
          head: [
              {
                  tag: 'link',
                  attrs: {
                      rel: 'stylesheet',
                      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=check,close',
                  },
              },
          ],
          customCss: ['./src/styles/custom.css'],
          social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
          sidebar: [
              {
                  label: 'INOI',
                  items: [
                      { label: 'Overview', slug: 'inoi/overview' },
                      { label: '2026', items: [{ autogenerate: { directory: 'INOI/2026' } }] },
                      { label: '2025', items: [{ autogenerate: { directory: 'INOI/2025' } }] },
                      { label: '2024', items: [{ autogenerate: { directory: 'INOI/2024' } }] },
                      { label: '2023', items: [{ autogenerate: { directory: 'INOI/2023' } }] },
                      { label: '2022', items: [{ autogenerate: { directory: 'INOI/2022' } }] },
                      { label: '2021', items: [{ autogenerate: { directory: 'INOI/2021' } }] },
                      { label: '2020', items: [{ autogenerate: { directory: 'INOI/2020' } }] },
                      { label: '2019', items: [{ autogenerate: { directory: 'INOI/2019' } }] },
                      { label: '2018', items: [{ autogenerate: { directory: 'INOI/2018' } }] },
                      { label: '2017', items: [{ autogenerate: { directory: 'INOI/2017' } }] },
                      { label: '2016', items: [{ autogenerate: { directory: 'INOI/2016' } }] },
                      { label: '2015', items: [{ autogenerate: { directory: 'INOI/2015' } }] },
                      { label: '2014', items: [{ autogenerate: { directory: 'INOI/2014' } }] },
                      { label: '2013', items: [{ autogenerate: { directory: 'INOI/2013' } }] },
                      { label: '2012', items: [{ autogenerate: { directory: 'INOI/2012' } }] },
                      { label: '2011', items: [{ autogenerate: { directory: 'INOI/2011' } }] },
                      { label: '2010', items: [{ autogenerate: { directory: 'INOI/2010' } }] },
                      { label: '2009', items: [{ autogenerate: { directory: 'INOI/2009' } }] },
                  ],
              },
              {
                  label: 'Guides',
                  items: [
                      // Each item here is one entry in the navigation menu.
                      { label: 'Example Guide', slug: 'guides/example' },
                  ],
              },
              {
                  label: 'Reference',
                  items: [{ autogenerate: { directory: 'reference' } }],
              },
          ],
      }),
	],

  adapter: cloudflare()
});