import React, {FC} from "react";
import {DocumentDetail} from "@/types/types";
import moment from "moment";

export interface HtmlPreviewProps {
  post?: DocumentDetail
}
const HtmlPreview: FC<HtmlPreviewProps> = (props) => {
  const date = moment(props.post.createdAt * 1000).format('ll')
    return (
        <div>
          <article className="container px-2 mx-auto mb4" itemScope={true}
                   itemType="http://schema.org/BlogPosting">
            <h1 className="h0 col-12 sm-width-full py-1 mt-1 inline-block"
                itemProp="name headline">{props.post?.title}</h1>
            <div className="col-4 sm-width-full mt-1 border-top-thin ">
              <p className="mb-3 py-1 bold h4">
                <time dateTime={date} itemProp="datePublished">{date}</time>
              </p>
            </div>
            <div dangerouslySetInnerHTML={{__html: props.post?.content}} className="prose" itemProp="articleBody">
            </div>
          </article>
        </div>
    );
}

export default HtmlPreview;