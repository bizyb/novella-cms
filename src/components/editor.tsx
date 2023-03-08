import React, {FC, useEffect, useState} from "react";
import axios from "axios";
import {DocumentDetail} from "@/types/types";
import {Box, Button, CircularProgress, Grid, Paper, TextField} from "@mui/material";
import {useRouter} from "next/router";
import { Editor } from "@tinymce/tinymce-react";
import {getHostName, tinyMceConfigs} from "@/components/utils";
import {apiPaths} from "@/paths";
import {toast, ToastContainer} from "react-toastify";
import slug from 'slug'

export interface CMSEditorProps {
  post?: DocumentDetail,
  onPostChange?: (document: DocumentDetail) => void
  apiKey?: string
}

const CMSEditor: FC<CMSEditorProps> = (props) => {
  const [publish, setPublish] = useState<boolean>(false)
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState<string>("")
  const [thumbnail, setThumbnail] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [currentSlug, setCurrentSlug] = useState<string>("")
  const [slugEditable, setSlugEditable] = useState<boolean>(true)
  const [showProgress, setShowProgress] = useState(false)
  const [isHomePage, setIsHomePage] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const router = useRouter()

  const configs = tinyMceConfigs
  if (router.pathname.includes("/editor")) {
    configs["height"] = '60vh'
  } else {
    configs["height"] = '40vh'
  }

  useEffect(() => {
    const key = "sessionApiKey"
    const cachedApiKey = localStorage.getItem(key)
    if (cachedApiKey && cachedApiKey !== 'undefined') {
      setApiKey(cachedApiKey)
    } else {
      setApiKey(props.apiKey)
      localStorage.setItem(key, props.apiKey)
    }
  }, [])

  useEffect(() => {
    if (router.pathname === "/") {
      setIsHomePage(true)
    } else {
      setIsHomePage(false)
    }
  }, [])

  useEffect(() => {
    if (props.post) {
      setPublish(props.post.published)
      setContent(props.post.content ? props.post.content : "")
      setTitle(props.post.title ? props.post.title : "")
      setDescription(props.post.description ? props.post.description : "")
      setThumbnail(props.post.thumbnail ? props.post.thumbnail : "")
      if (props.post.slug) {
        setCurrentSlug(props.post.slug)
        setSlugEditable(false)
      }
    }
  }, [])


  const handleChange = (content) => {
    setContent(content)
  }

  const handleTitleChange = (event) => {
    event.preventDefault()
    setTitle(event.target.value)
    if (slugEditable) {
      setCurrentSlug(slug(event.target.value))
    }
  }

  const handleThumbnailChange = (event) => {
    event.preventDefault()
    setThumbnail(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    event.preventDefault()
    setDescription(event.target.value)
  }

  const saveToDb = () => {
    if (title && slug) {
      const document: DocumentDetail = {
        title: title,
        content: content,
        published: publish,
        slug: currentSlug,
        uid: props.post?.uid,
        apiKey: apiKey,
        thumbnail: thumbnail,
        description: description
      }
      axios.post(`${getHostName()}${apiPaths.editorUpsert}`, document)
      .then(result => {
        if (!isHomePage) {
          toast("Document updated!", {
            type: 'success',
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
        props.onPostChange(document)
        if (!router.pathname.includes("editor")) {
          setShowProgress(true)
          router.push({
            pathname: "/editor/" + JSON.parse(result.data).uid,
            query: { apiKey: apiKey },
          }).catch(e => console.log(e))
        }
      })
      .catch(e => console.log(e))
    } else {
      toast("Please provide a title", {
        type: 'error',
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  const onCreateNew = () => {
    router.push("/")
    .catch(e => console.log(e))
  }


  // @ts-ignore
  return (
      <div className="editor-container">
        {
            showProgress && (
                <Box className="center-aligned">
                <CircularProgress color="error"/>
              </Box>
            )

        }
        <Paper sx={{p: 1}}>
        <Grid container sx={{p: 2, mb: 1}}>
          <Grid item sm={12} sx={{
            pt: 1,
            pb: 2
          }}>
            <TextField
                inputProps={{
                  style: {
                    fontSize: '24px',
                    fontWeight: '700',
                    paddingTop: '30px',
                    paddingBottom: '30px'}
                }}
                value={title}
                fullWidth
                id="outlined-required"
                label="Title"
                onChange={handleTitleChange}
            />
          </Grid>
          {
            !isHomePage && <>
                <Grid item sm={12} sx={{
                  pt: 1,
                  pb: 2
                }}>
                  <TextField
                      value={description}
                      fullWidth
                      multiline
                      minRows={2}
                      id="outlined-required"
                      label="Description"
                      onChange={handleDescriptionChange}
                  />
                </Grid>
                <Grid item sm={12} sx={{
                  pt: 1,
                  pb: 2
                }}>
                  <TextField
                      inputProps={{
                        style: {
                          fontSize: '16px',
                          paddingTop: '30px',
                          paddingBottom: '30px'}
                      }}
                      value={thumbnail}
                      fullWidth
                      id="outlined-required"
                      label="Thumbnail"
                      onChange={handleThumbnailChange}
                  />
                </Grid>
              </>
          }
          <Grid item sm={12}>
            <Editor
                id="tiny-editor"
                tinymceScriptSrc="/assets/js/tinymce/tinymce.min.js"
                onEditorChange={handleChange}
                value={content}
                init={tinyMceConfigs}
            />
          </Grid>
          <Grid item sm={isHomePage ? 2 : 6} sx={{mt: 2,  display: 'inline-grid', p: 2}}>
            <Button
                onClick={saveToDb}
                variant="contained"
                color='success'
            >
              {isHomePage ? 'Preview' : 'Update'}
            </Button>
          </Grid>
          {
            !isHomePage && (
              <Grid item sm={6} sx={{mt: 2,  display: 'inline-grid', p: 2}}>
                <Button
                    onClick={onCreateNew}
                    variant="contained"
                    color='warning'
                >
                  Create New Post
                </Button>
              </Grid>
            )
          }
        </Grid>
        </Paper>
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
      </div>
  )
}

export default CMSEditor