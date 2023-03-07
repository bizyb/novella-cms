import React, {FC, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {Button, Grid} from "@mui/material";
import {getHostName} from "@/components/utils";
import {apiPaths} from "@/paths";


const ReactJson = dynamic(() => import('react-json-view'), {
    loading: () => <p>Loading...</p>,
    ssr: false
},)

export interface SandBoxProps {
  singlePostApiData?: any,
}

const SandBox: FC<SandBoxProps> = (props) => {
  const [singlePostData, setSinglePostData] = useState<any>(null)
  const [allPostsData, setAllPostsData] = useState<any>([])
  const [showAllPosts, setShowAllPosts] = useState(false)

  useEffect(() => {
    setSinglePostData({
      ...props.singlePostApiData
    })
  }, [props.singlePostApiData])

  const getAllPosts = () => {
    setShowAllPosts(true)
    const url = `${getHostName()}${apiPaths.editorDashboard}`
    const apiUrl = `${getHostName()}${apiPaths.getPosts}`
    const request = {
      "Content-Type": "application/json",
      method: 'GET',
      url: apiUrl
    }
    fetch(url).then(result => {
      result.text().then(text => {
        const allPosts = JSON.parse(text)
        setAllPostsData({
          posts: allPosts ? JSON.parse(allPosts).posts : [],
          request: request
        })
      }).catch(e => console.log(e))
    }).catch(e => console.log(e))
  }

    return (
        <Grid container>
          <Grid item sm={12}>
            <p>API</p>
          </Grid>
          <Grid item sm={3}>
            <Button
                onClick={() => setShowAllPosts(false)}
                variant={showAllPosts ? 'outlined' : 'contained'}
                sx={{mb: 2, textTransform: 'none'}}>
              View Current Document
            </Button>
          </Grid>
          <Grid item sm={3}>
            <Button
                onClick={getAllPosts}
                variant={showAllPosts ? 'contained' : 'outlined'}
                sx={{mb: 2, textTransform: 'none'}}
            >
              View All Documents
            </Button>
          </Grid>
          <Grid item sm={12} sx={{mt: 2}}>
            <h5>Request</h5>
            <ReactJson src={showAllPosts ? allPostsData.request : singlePostData?.request } name={null}/>
            <h5 style={{marginTop: '10px'}}>Response</h5>
            <ReactJson src={showAllPosts ? allPostsData?.posts : singlePostData?.post } name={null}/>
          </Grid>
        </Grid>
    )
}

export default SandBox;