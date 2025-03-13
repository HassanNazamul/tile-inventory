"use client"

import * as React from "react"
import {
  AudioWaveform,
  ListCheck,
  ShoppingBag,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  LayoutList,
  Warehouse,
} from "lucide-react"

import { NavMain } from "@/app/_common/sidebar/nav-main"
import { NavProjects } from "@/app/_common/sidebar/nav-projects"
import { NavUser } from "@/app/_common/sidebar/nav-user"
import { TeamSwitcher } from "@/app/_common/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Inventory",
      url: "/inventory",
      icon: ShoppingBag,
      isActive: true,
      items: [
        {
          title: "Add Inventory",
          url: "/inventory",
        },
        {
          title: "Add Design Name",
          url: "/inventory/products",
        },
        {
          title: "Add Brand",
          url: "/inventory/brands",
        },
        {
          title: "Add Size",
          url: "/inventory/sizes",
        },
      ],
    },
    {
      title: "Sales",
      url: "/sales",
      icon: LayoutList,
      items: [
        {
          title: "Manage Sales",
          url: "/sales",
        },
      ],
    },
    {
      title: "Warehouse",
      url: "/warehouse",
      icon: Warehouse,
      items: [
        {
          title: "Manage Warehouse",
          url: "/warehouse",
        }
        // ,
        // {
        //   title: "Get Started",
        //   url: "#",
        // },
        // {
        //   title: "Tutorials",
        //   url: "#",
        // },
        // {
        //   title: "Changelog",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
