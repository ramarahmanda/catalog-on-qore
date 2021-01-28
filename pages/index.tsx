import React from "react";
import { css } from "@emotion/css";
import {
  Button,
  Input,
  Typography,
  Avatar,
  List,
  Spin,
  Alert,
  Modal
} from "antd";
import {
  EyeOutlined,
  GithubOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { client, } from "../qoreContext";
import dayjs from "../dayjs";
import { ProjectSchema } from "@feedloop/qore-client";
import Layout from './layout';
import estimateReadTime from './api/estimate-read'
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from "next/link";
import ReactMarkdown from 'react-markdown'

const LIMIT = 50

export default function Home() {
  const [page, setPage] = React.useState<{ offset: number, limit: number, order: 'desc' | 'asc', q?: string }>({ offset: 0, limit: LIMIT, order: 'desc' })
  const [isEnd, setEnd] = React.useState(false)
  const [repositories, setRepositories] = React.useState<ProjectSchema['allRepository']['read'][]>([])
  const loadMoreRows = React.useCallback(async () => {
    const { data } = await client.views.allRepository.readRows({ ...page, offset: repositories.length }).toPromise()
    setRepositories(c => [...c, ...data?.nodes || []])
    if ((data?.nodes.length || 0) < LIMIT) setEnd(true)
  }, [repositories, page])
  const [modalInfo, setModalInfo] = React.useState<{ visible: boolean, data?: ProjectSchema['allRepository']['read'] }>({ visible: false })

  React.useEffect(() => {
    loadMoreRows()
  }, [])

  const onSearch = React.useCallback(async (search: string) => {
    setPage(c => ({ ...c, q: search }))
    const { data } = await client.views.allRepository.readRows({ ...page, offset: 0, q: search }).toPromise()
    setRepositories([...data?.nodes || []])
  }, [page])
  return (
    <Layout>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <div className="relative pb-20 px-4 sm:px-6 lg:pt-16 lg:pb-28 lg:px-8">
            <div className="absolute inset-0">
              <div className="bg-white h-1/3 sm:h-2/3"></div>
            </div>
            <div className="relative max-w-7xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
                  Qore Templates
                  </h2>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                  Browse through our professionally designed selection of free templates and customize a template for any occasion.
                  </p>
                <Input autoFocus onPressEnter={(event) => onSearch(event.currentTarget.value)} className={css`max-width: 50%; margin:10px;`} size="large" placeholder="Find your template" prefix={<SearchOutlined />} />
              </div>
              <div className='w-full h-full'>
                <InfiniteScroll
                  className={css`
                    overflow: hidden !important;
                  `}
                  dataLength={repositories.length} //This is important field to render the next data
                  next={loadMoreRows}
                  hasMore={!isEnd}
                  loader={<div className="text-center"><Spin /></div>}
                  endMessage={repositories.length <= LIMIT ? undefined : <Alert closable className="text-center" message="All data has been fetched" type="success" />}
                  // below props only if you need pull down functionality
                  refreshFunction={loadMoreRows}
                >

                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 3,
                      lg: 3,
                      xl: 3,
                      xxl: 3,
                    }}
                    dataSource={repositories}
                    renderItem={item => (
                      <div onClick={() => setModalInfo({ visible: true, data: item })}><BlogCard data={item} /></div>
                    )}
                  />
                </InfiniteScroll>
              </div>

            </div>
          </div>
        </div>

      </div>
      <ModalBlog data={modalInfo.data} visible={modalInfo.visible} onCancel={() => setModalInfo(c => ({ visible: false }))} />
    </Layout>

  );
}

const BlogCard = (props: {
  data: ProjectSchema['allRepository']['read']
}) => {
  const { data } = props;
  return <div className="flex flex-col rounded-lg shadow-lg overflow-hidden m-4">
    <div className="flex-shrink-0">
      <img className="h-48 w-full object-cover bg-gray-400" src={data.photoUrl} />
    </div>
    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-indigo-600">
          <a href="#" className="hover:underline">
            {data.categoryName}
          </a>
        </p>
        <a href="#" className="block mt-2">
          <p className="text-xl font-semibold text-gray-900">
            {data.name}
          </p>
          <Typography.Paragraph className="mt-3 text-base text-gray-500" ellipsis={{ rows: 3, expandable: false }}>
            {data.summary}
          </Typography.Paragraph>
        </a>
      </div>
      <div className="mt-6 flex items-center">
        <div className="flex-shrink-0">
          <a href="#">
            <span className="sr-only">{ }</span>
            <Avatar alt={data.authorName} src={data.authorPhotoUrl} size="large">
              {(data.authorName || "")[0]}
            </Avatar>
          </a>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            <a href="#" className="hover:underline">
              {data.authorName}
            </a>
          </p>
          <div className="flex space-x-1 text-sm text-gray-500">
            <time>
              {dayjs(data.createdAt).format('MMM D, YYYY')}
            </time>
            <span aria-hidden="true">
              &middot;
            </span>
            <span>
              {estimateReadTime(data.content || "") + " "}min read
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
}

const ModalBlog = (props: { visible: boolean, onCancel: () => void, data?: ProjectSchema['allRepository']['read'] }) => {
  return <Modal
    visible={props.visible}
    onCancel={props.onCancel}
    width="80%"
    footer={null}
  >
    <div className="relative py-16 bg-white overflow-hidden">
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
        <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
          <svg className="absolute top-12 left-full transform translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="74b3fd99-0a6f-4271-bef2-e80eeafdf357" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
          </svg>
          <svg className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
          </svg>
          <svg className="absolute bottom-12 left-full transform translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="d3eb07ae-5182-43e6-857d-35c643af9034" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
          </svg>
        </div>
      </div>
      <div className="relative px-4 sm:px-6 lg:px-24">
        <div className="text-lg max-w-prose mx-auto">
          <h1>
            <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">{props.data?.categoryName}</span>
            <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">{props.data?.name}</span>
          </h1>
          <p className="mt-8 text-xl text-gray-500 leading-8">{props.data?.summary}</p>
          <Link href={props.data?.gitRepoUrl || ""}><Button>
            <GithubOutlined className={css`vertical-align: middle;`} />See on GitHub
          </Button></Link>
          <Link href={props.data?.demoUrl || ""}><Button className='ml-4' type="primary">
            <EyeOutlined className={css`vertical-align: middle;`} />See demo
          </Button></Link>

        </div>
        <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
          <img className="w-full rounded-lg" src={props.data?.photoUrl} alt="" width="1310" height="873" />
          <ReactMarkdown children={props.data?.content || ""} />
        </div>
      </div>
    </div>
  </Modal>
}