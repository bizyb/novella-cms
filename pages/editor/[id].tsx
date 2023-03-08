import React, {FC, useEffect, useState} from 'react';
import Head from "next/head";
import {getHostName} from "@/components/utils";
import {DocumentDetail} from "@/types/types";
import CMSEditor from "@/components/editor";
import {apiPaths} from "@/paths";
import {Grid} from "@mui/material";
import SandBox from "@/components/sandbox";
import {useRouter} from "next/router";

export async function getServerSideProps(context) {
  const {id, apiKey} = context.query
  const url = `${getHostName()}${apiPaths.editorGet}/${id}?apiKey=${apiKey}`
  const response = await fetch(url)
  const post = JSON.parse(await response.text())
  const document: DocumentDetail = JSON.parse(post)?.post as DocumentDetail
  let apiUrl = null
  if (document && document.slug) {
    apiUrl = `${getHostName()}${apiPaths.getPostBySlug}/${document.slug}?apiKey=${apiKey}`
  }
  const request = {
    request: {
      "Content-Type": "application/json",
      method: 'GET',
      url: apiUrl,
    }
  }
  return {
    props: {
      post: document,
      enableSandbox: process.env.REACT_ENABLE_SANDBOX !== 'false',
      request: apiUrl ? request : null
    }
  }
}

export interface EditorIndexProps {
  post?: DocumentDetail,
  enableSandbox?: boolean,
  request?: any
}

const Index: FC<EditorIndexProps> = (props) => {
  const [singlePostData, setSinglePostData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (props.request) {
      setSinglePostData({
        ...props.request,
        post: props.post
      })
    } else {
      // Request not found, i.e. document not found so redirect to home page
      router.push("/")
      .catch(e => console.log(e))
    }
  }, [])

  const onPostChange = (updatedPost: DocumentDetail) => {
    if (updatedPost) {
      setSinglePostData({
        ...props.request,
        post: updatedPost
      })
    } else {
      setSinglePostData({})
    }
  }

  return (
      <>
        <Head>
          <title>{ props.post?.title + " | Novella CMS"}</title>
        </Head>
        <Grid container spacing={3}>
          <Grid item sm={props.enableSandbox ? 6 : 12}>
            <CMSEditor post={props.post} onPostChange={onPostChange}/>
          </Grid>
          {
            props.enableSandbox &&
              <Grid item sm={6}>
                {
                   <SandBox singlePostApiData={singlePostData}/>
                }
              </Grid>
          }

        </Grid>
      </>

  );
}

export default Index