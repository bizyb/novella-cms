import Head from 'next/head';
import {FC} from "react";
import {Post} from "@/types/types";
import DetailView from "../../src/components/DetailView";
import {API_PATHS} from "@/constants";
import {getHostName} from "../../src/components/utils";

export async function getServerSideProps(context) {
  const response = await fetch(`${getHostName()}${API_PATHS.GET_POST_BY_SLUG}/${context.query.slug}`)
  const post = JSON.parse(await response.text())
  return {
    props: {
      post: JSON.parse(post)?.post
    }
  }
}

interface PostProps {
  post?: Post
}

const Post: FC<PostProps> = (props) => {
  return (
    <section>
      <Head>
        <title>{props.post?.title}</title>
        <meta name="description" content={props.post?.description}/>
      </Head>
      <DetailView post={props.post}/>
    </section>
  )
}

export default Post