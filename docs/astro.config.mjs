import {defineConfig} from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'λλλ',
            social: {
                'x.com': 'https://x.com/mckee_plus_plus',
                github: 'https://github.com/eighty4/l3',
            },
            sidebar: [
                {
                    label: 'Getting started',
                    items: [
                        {label: 'Installation', link: '/getting_started/installation/'},
                        {label: 'Creating a project', link: '/getting_started/create_a_project/'},
                    ],
                },
                {
                    label: 'Guides',
                    items: [
                        {label: 'Syncing', link: '/guides/syncing/'},
                        {label: 'Routing', link: '/guides/routing/'},
                        {label: 'Environment Variables', link: '/guides/env_vars/'},
                    ],
                },
                {
                    label: 'Advanced',
                    items: [
                        {label: 'Production', link: '/advanced/production/'},
                    ],
                },
                {
                    label: 'Reference',
                    autogenerate: {directory: 'reference'},
                },
            ],
        }),
    ],
})
