/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
// import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import {
  Alert,
  Button,
  SafeAreaView,
  useColorScheme,
  View,

} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';



const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  // const fileName = 'testPDFfile';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const downloadFileWithBlobUtil = () => {
    console.log("working, but removed due to ios conflict ");
    // const source = "https://www.africau.edu/images/default/sample.pdf";
    // var fileName = source.substring(source.lastIndexOf('/')+1);
    // let dirs = ReactNativeBlobUtil.fs.dirs.DownloadDir;
    // ReactNativeBlobUtil.config({
    //   fileCache: false,
    //   appendExt: 'pdf',
    //   path: `${dirs}/${fileName}`,
    //   addAndroidDownloads: {
    //     useDownloadManager: true,
    //     notification: true,
    //     title: fileName,
    //     description: 'File downloaded by download manager.',
    //     mime: 'application/pdf',
    //   },
    // })
    //   .fetch('GET', source)
    //   .then(async(res) => {
    //     // in iOS, we want to save our files by opening up the saveToFiles bottom sheet action.
    //     // whereas in android, the download manager is handling the download for us.
    //     if (Platform.OS === 'ios') {
    //       const filePath = res.path();
    //       let options = {
    //         type: 'application/pdf',
    //         url: filePath,
    //         saveToFiles: true,
    //       };
    //       Share.open(options)
    //         .then((resp) => console.log(resp))
    //         .catch((err) => console.log(err));
    //     } 
    //   })
    //   .catch((err) => console.log('BLOB ERROR -> ', err));
  };



  const sharePDFWithAndroid = (fileUrl, type) => {
    // let filePath = null;
    const configOptions = { fileCache: true };
    RNFetchBlob.config(configOptions)
      .fetch('GET', fileUrl)
      .then(async base64Data => {
        base64Data = `data:${type};base64,` + base64Data;
        await Share.open({ url: base64Data })
        .then((resp) => console.log(resp))
        .catch((err) => console.log(err));
        // remove the image or pdf from device's storage
        // await RNFS.unlink(filePath);
      });
  }

  const downloadFileWithRNFetchBlob =() => {
    const url = "https://www.africau.edu/images/default/sample.pdf";
    var fileName = url.substring(url.lastIndexOf('/')+1);
    const { config, fs } = RNFetchBlob;
    const downloads = fs.dirs.DownloadDir;
    return config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache : false,
      path: downloads + `/${fileName}`,
      addAndroidDownloads : {
        useDownloadManager : true,
        notification: true,
        title: fileName,
        // description: 'File downloaded by download manager.',
        // mime: 'application/pdf',
        path:  downloads + '/' + fileName + '.pdf',
      }
    })
    .fetch('GET', url)
    .then(async(res) => {
      // in iOS, we want to save our files by opening up the saveToFiles bottom sheet action.
      // whereas in android, the download manager is handling the download for us.
      if (Platform.OS === 'ios') {
        const filePath = res.path();
        let options = {
          type: 'application/pdf',
          url: filePath,
          saveToFiles: true,
        };
        await Share.open(options)
          .then((resp) => console.log(resp))
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log('BLOB ERROR -> ', err));

  }

  async function  sharePrintIOS() {
    console.log("Not working");
    // const url = 'https://www.africau.edu/images/default/sample.pdf';
    // const message = 'Sharing PDF file';
    // const options = Platform.select({
    //   ios: {
    //     activityItemSources: [
    //       {
    //         // For sharing text.
    //         placeholderItem: { type: 'text', content: message+'placeholder' },
    //         item: {
    //           print : url,
    //           message: "null is copied", // Specify no text to share via Messages app.
    //         },
    //         linkMetadata: {
    //           // For showing app icon on share preview.
    //           title: message+'meta',
    //         },
    //       }
    //     ],
    //   },
    // });

    // return await Share.open(options)
    // .then((resp) => console.log(resp))
    // .catch((err) => console.log(err));;
  }

  async function printPDFIos() {
    const url = "https://www.africau.edu/images/default/sample.pdf"
    const title = 'Sharing PDF file';
    let type = 'application/pdf';
    let filePath = url;

    const configOptions = { fileCache: true };
    await RNFetchBlob.config(configOptions)
      .fetch('GET', url)
      .then(resp => {
        filePath = resp.path();
        return resp.readFile('base64');
      })
      .then(async base64Data => {
        base64Data = `data:${type};base64,` + base64Data;

        const options = Platform.select({
          ios: {
            url: base64Data,
            title: 'File name soemhing'
          },
          default: {
            title,
            subject: title,
          },
          print: base64Data
        });

        await Share.open(options)
          .then((res) => { console.log(res) })
          .catch((err) => { err && console.log(err); });
        // remove the image or pdf from device's storage
        // await RNFS.unlink(filePath);
      })
      .catch((err) => { err && console.log(err); });
  }


  return (
    <SafeAreaView style={backgroundStyle}>
        <View>
          <Button title ="Download PDF with Blob Util" onPress={downloadFileWithBlobUtil}></Button>
          <Button title ="Download PDF with Fetch Blob" onPress={downloadFileWithRNFetchBlob}></Button>
          <Button title ="Share PDF file with Print option Android" onPress={() => {sharePDFWithAndroid("https://www.africau.edu/images/default/sample.pdf",'application/pdf')}}></Button>
          <Button title ="Share PDF file with Print option IOS" onPress={async () => {await sharePrintIOS()}}></Button>
          <Button title ="Share PDF file with Print option IOS 2" onPress={async () => {await printPDFIos()}}></Button>
        </View>
    </SafeAreaView>
  );
};

export default App;
