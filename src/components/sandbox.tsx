import React, {FC, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {Box, Button, FormControlLabel, Grid, Switch} from "@mui/material";
import {getHostName} from "@/components/utils";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {apiPaths} from "@/paths";
import HtmlPreview from "@/components/htmlPreview";
import {toast, ToastContainer} from "react-toastify";


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
  const [showHtml, setShowHtml] = useState(false)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    const key = "sessionApiKey"
    const cachedApiKey = localStorage.getItem(key)
    if (cachedApiKey) {
      setApiKey(cachedApiKey)
    }
  }, [])

  useEffect(() => {
    setSinglePostData({
      ...props.singlePostApiData
    })
  }, [props.singlePostApiData])

  const handleHtmlToggle = () => {
    setShowHtml(!showHtml)
  }

  const copyToClipboard = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(apiKey).then(
          () => {
            toast("API Key copied", {
              type: 'success',
              position: toast.POSITION.BOTTOM_RIGHT
            });
          },
          () => {}
      ).catch(e => console.log(e));
    }
  }

  const getAllPosts = () => {
    setShowAllPosts(true)
    setShowHtml(false)
    const url = `${getHostName()}${apiPaths.editorDashboard}?apiKey=${apiKey}`
    const apiUrl = `${getHostName()}${apiPaths.getPosts}?apiKey=${apiKey}`
    const request = {
      "Content-Type": "application/json",
      method: 'GET',
      url: apiUrl
    }
    fetch(url).then(result => {
      result.text().then(text => {
        const allPosts = JSON.parse(text)
        setAllPostsData({
          posts: allPosts ? allPosts.posts : [],
          request: request
        })
      }).catch(e => console.log(e))
    }).catch(e => console.log(e))
  }

    return (
        <>
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
          <Grid item xs={12}>
            <span className="api-key-heading">Your API key</span>
            <Box className="api-key-box">
              <Button
                  color="info"
                  startIcon={<ContentCopyIcon/>}
                  size='small'
                  sx={{height: '32px'}}
                  variant='text'
                  onClick={copyToClipboard}>
                <span className="api-key-text">{apiKey}</span>
              </Button>

            </Box>
          </Grid>
          {!showAllPosts &&
              <Grid item xs={12}>
                <Box p={0}>
                  <FormControlLabel
                      control={<Switch color="warning" defaultChecked={false}
                                       onChange={handleHtmlToggle}/>}
                      label={'HTML'}
                  />
                </Box>
              </Grid>
          }
          {
            showHtml && !showAllPosts ? (
                <Grid item sm={12}><HtmlPreview post={singlePostData?.post}/></Grid>
                ) : (
                <Grid item sm={12} sx={{mt: 2, p: 2}}>
                  <h5>Request</h5>
                  <ReactJson src={showAllPosts ? allPostsData.request : singlePostData?.request } name={null}/>
                  <h5 style={{marginTop: '10px'}}>Response</h5>
                  <ReactJson src={showAllPosts ? allPostsData?.posts : singlePostData?.post } name={null}/>
              </Grid>
            )
          }
        </Grid>
        <ToastContainer
            style={{width: '100%', maxWidth: '600px'}}
            position="top-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"/>
          </>
    )
}

export default SandBox;