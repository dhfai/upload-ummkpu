import Icons from '@/components/global/icons'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import Link from 'next/link'
import React from 'react'
import { ListItem } from './ListItem'












const components: { title: string; href: string; description: string }[] = [
    {
      title: "Images",
      href: "/images",
      description:
        "A collection of images that can be viewed, downloaded, and shared.",
    },
    {
      title: "Videos",
      href: "/videos",
      description:
        "All the videos you've uploaded to your account.",
    },
    {
      title: "Albums",
      href: "/albums",
      description:
        "Albums are collections of images or videos that you can share with others.",
    },
    {
      title: "Add Image",
      href: "/add/add-image",
      description: "Upload an image to your account.",
    },
    {
      title: "Add Video",
      href: "/add/add-video",
      description:
        "Upload a video to your account.",
    },
    {
      title: "Create Album",
      href: "/add/create-album",
      description:
        "Create a new album and add images or videos to it.",
    },
  ]

const NavLink = () => {
  return (
    <>
        <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ul className="flex items-center justify-center gap-8">
                <Link href="/" className="hover:text-foreground/80 text-sm">Home</Link>

                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                        <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                <a
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    href="/"
                                >
                                    <Icons.logo className="h-6 w-6" />
                                    <div className="mb-2 mt-4 text-lg font-medium">
                                    shadcn/ui
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                    Beautifully designed components that you can copy and
                                    paste into your apps. Accessible. Customizable. Open
                                    Source.
                                    </p>
                                </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </ListItem>
                            <ListItem href="/docs/installation" title="Installation">
                                How to install dependencies and structure your app.
                            </ListItem>
                            <ListItem href="/docs/primitives/typography" title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </ListItem>
                            </ul>
                        </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                        <NavigationMenuTrigger>Pages</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (
                                <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                                >
                                {component.description}
                                </ListItem>
                            ))}
                            </ul>
                        </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                        <Link href="/docs" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Documentation
                            </NavigationMenuLink>
                        </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                    </NavigationMenu>
            </ul>
        </nav>
    </>
  )
}

export default NavLink
