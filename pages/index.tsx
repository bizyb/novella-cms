import React, {FC} from 'react';
import Head from "next/head";
import CMSEditor from '@/components/editor';
import Hero from "@/components/hero";


export interface EditorIndexProps {
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