import {DocumentDetail, DocumentMetadata} from "@/types/types";
export const getHostName = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_HOSTNAME
  }
  return process.env.REACT_APP_HOSTNAME + ":" + process.env.REACT_APP_PORT
}

export const getEpochTime = () => {
  return Math.round(Date.now() / 1000)
}

export const getIpAddress = (req) => {
  let ip: string = req.ip
  if (ip === undefined) {
    ip = req.socket?.remoteAddress
  }
  if (ip.substring(0, 7) == "::ffff:") {
    ip = ip.substring(7)
  }
  return ip
}

export const randomId = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function toArray(documentDetails: IterableIterator<DocumentDetail>) {
  const records = []
  let record = documentDetails.next()
  while (!record.done) {
    records.push(record.value)
    record = documentDetails.next()
  }
  return records;
}

const getTargetDocument = (data: Map<string, DocumentDetail>,
                          currentRecord: DocumentDetail, prev: boolean): DocumentMetadata | null => {
  try {
    const records: DocumentDetail[] = toArray(data.values())
    const sortedRecords = records.filter(it => it.slug)
    .sort((a, b) => a.createdAt - b.createdAt)
    for (let i = 0; i < sortedRecords.length; i++) {
      const r = sortedRecords[i]
      if (r.uid === currentRecord.uid) {
        let index = i + 1
        if (prev) {
          index = i - 1
        }
        if (index < sortedRecords.length && index >= 0) {
          const targetRecord = sortedRecords[index]
          return {
            uid: targetRecord.uid,
            slug: targetRecord.slug,
            createdAt: targetRecord.createdAt,
            title: targetRecord.title,
          }
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
  return null
}

export const getNextDocument = (data: Map<string, DocumentDetail>,
                                currentRecord: DocumentDetail): DocumentMetadata | null => {
  return getTargetDocument(data, currentRecord, false)

}

export const getPrevDocument = (data: Map<string, DocumentDetail>,
                                currentRecord: DocumentDetail): DocumentMetadata | null => {
  return getTargetDocument(data, currentRecord, true)
}

export const tinyMceConfigs: any = {
  mode : "specific_textareas",
  editor_selector : "textarea",
  skin: "oxide",
  resize: 'both',
  branding: false,
  statusbar: false,
  menubar: 'file edit view insert format tools table',
  toolbar: 'fullscreen | undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor | ltr rtl',
  plugins: [
    'preview',
    'searchreplace',
    'fullscreen',
    'link',
    'table',
    'insertdatetime',
    'advlist',
    'lists',
    'wordcount',
    'quickbars',
  ],
  removed_menuitems: 'newdocument',
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  noneditable_noneditable_class: 'mceNonEditable',
  content_css: 'document-editor',
  content_style: "body {padding: 10px}",
  contextmenu: 'link image imagetools table',
  templates: [
    { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
    { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
    { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
  ],
  template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
  template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
  toolbar_sticky: true
}

