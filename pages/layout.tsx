import React from "react";
import {
  Button,
  Menu,
  Dropdown
} from "antd";
import {
  MenuOutlined,
} from "@ant-design/icons";
import Link from "next/link";
export default function Layout(props: {
  children: React.ReactNode
}) {
  return (

    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="block lg:hidden h-8 w-auto" src="/qore-logo-black.svg" alt="Qore" />
                <img className="hidden lg:block h-8 w-auto" src="/qore-logo-black.svg" alt="Qore" />
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* <Button type='primary'>Submit your work</Button> */}

              <div className="ml-3 relative">
                <Link href="https://dashboard.qorebase.io"><Button>Console</Button></Link>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <Dropdown overlay={<Menu>
                {/* <Menu.Item key="0">
                  <a href="#">Submit your work</a>
                </Menu.Item> */}
                <Menu.Item key="1">
                  <a href="https://dashboard.qorebase.io">Console</a>
                </Menu.Item>
              </Menu>} trigger={['click']}>
                <MenuOutlined style={{ fontSize: '20px' }} />
              </Dropdown>
            </div>
          </div>
        </div>

      </nav>
      <div className="py-5">
        <main>
          {props.children}
        </main>
      </div>
    </div>

  );
}
