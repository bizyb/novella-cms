import React, {FC} from 'react';
import Head from "next/head";
import CMSEditor from '@/components/editor';
import Hero from "@/components/hero";
import {getHostName} from "@/components/utils";
import {apiPaths} from "@/paths";


export async function getServerSideProps() {
  const url = `${getHostName()}${apiPaths.apiKeyGenerator}`
  const response = await fetch(url)
  const keyResponse = JSON.parse(await response.text())
  return {
    props: keyResponse
  }
}

export interface EditorIndexProps {
  apiKey?: string
}

const Index: FC<EditorIndexProps> = (props) => {
  return (
      <>
        <Head>
          <title>Create New Blog Post</title>
        </Head>
        <Hero/>
        <div className="cms-demo">
          <CMSEditor onPostChange={() => {}} apiKey={props.apiKey}/>
        </div>
      </>

  );
}

export default Index