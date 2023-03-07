import React, {FC, useEffect, useState} from 'react';
import Head from "next/head";
import {getHostName} from "@/components/utils";
import {DocumentDetail} from "@/types/types";
import initializeBasicAuth from 'nextjs-basic-auth'
import CMSEditor from "@/components/editor";
import {apiPaths} from "@/paths";
import {authUsers} from "@/auth";
import {Grid} from "@mui/material";
import SandBox from "@/components/SandBox";

const basicAuthCheck = initializeBasicAuth({
  users: authUsers
})

export async function getServerSideProps(context) {
  const {req, res} = context
  await basicAuthCheck(req, res)
  const id = context.query.id
  const url = `${getHostName()}${apiPaths.editorGet}/${id}`
  const request = {
    request: {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'GET',
      url: url
    }
  }

  const response = await fetch(url)
  const post = JSON.parse(await response.text())
  return {
    props: {
      post: JSON.parse(post)?.post,
      enableSandbox: process.env.REACT_ENABLE_SANDBOX !== 'false',
      request: request
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

  useEffect(() => {
    setSinglePostData({
      ...props.request,
      ...props.post
    })
  }, [])

  const onPostChange = (updatedPost: DocumentDetail) => {
    if (updatedPost) {
      setSinglePostData({
        ...props.request,
        ...updatedPost
      })
    } else {
      setSinglePostData({})
    }
  }

  return (
      <>
        <Head>
          <title>{ props.post?.title + " | Editor"}</title>
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