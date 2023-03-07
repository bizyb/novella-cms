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
        <Grid container spacing={2} sx={{p: 2}}>
          <Grid item xs={12} sx={{display: 'inline-flex'}}>
            <Button
                onClick={() => setShowAllPosts(false)}
                variant={showAllPosts ? 'outlined' : 'contained'}
                sx={{
                  mb: 1,
                  textTransform: 'none',
                  width: '154px',
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px'}}>
              Current Document
            </Button>
            <Button
                onClick={getAllPosts}
                variant={showAllPosts ? 'contained' : 'outlined'}
                sx={{
                  mb: 1,
                  textTransform: 'none',
                  width: '154px',
                  borderTopLeftRadius: '0px',
                  borderBottomLeftRadius: '0px'
                }}
            >
              All Documents
            </Button>
          </Grid>
          <Grid item sm={12} sx={{mt: 2, p: 2}}>
            <h5>Request</h5>
            <ReactJson src={showAllPosts ? allPostsData.request : singlePostData?.request } name={null}/>
            <h5 style={{marginTop: '10px'}}>Response</h5>
            <ReactJson src={showAllPosts ? allPostsData?.posts : singlePostData?.post } name={null}/>
          </Grid>
        </Grid>
    )
}

export default SandBox;