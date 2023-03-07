import React, {FC} from 'react';
import Head from "next/head";
import initializeBasicAuth from 'nextjs-basic-auth'
import CMSEditor from '@/components/editor';
import {authUsers} from "@/auth";
import Hero from "@/components/hero";

const basicAuthCheck = initializeBasicAuth({
  users: authUsers
})

export async function getServerSideProps(context) {
  const {req, res} = context

  await basicAuthCheck(req, res)

  return {
    props: {
      createNew: true
    }
  }
}

export interface EditorIndexProps {
  createNew?: boolean
}

const Index: FC<EditorIndexProps> = (_props) => {
  return (
      <>
        <Head>
          <title>Create New Blog Post</title>
        </Head>
        <Hero/>
        <div className="cms-demo">
          <CMSEditor onPostChange={() => {}}/>
        </div>
      </>

  );
}

export default Index