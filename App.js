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
  Platform,
  SafeAreaView,
  useColorScheme,
  View,

} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { pdfData } from './pdfData';
import RNFS from 'react-native-fs';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  // const fileName = 'testPDFfile';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const sharePDF = (fileUrl, type) => {
    // let filePath = null;
    let filePath = fileUrl;
    const title = 'Sharing PDF file';
    const configOptions = { fileCache: true };
    RNFetchBlob.config(configOptions)
      .fetch('GET', fileUrl)
      .then(resp => {
        filePath = resp.path();
        return resp.readFile('base64');
      })
      .then(async base64Data => {
        console.log("orginal",base64Data);
        base64Data = `data:${type};base64,` + base64Data;
        const iosOptions = {
          url: base64Data,
          title: 'File name something',
          default: {
            title,
            subject: title,
          },
          print: base64Data
        };
        const androidOption = {
          url: base64Data 
        }
        console.log("modified",base64Data);
        let option = Platform.OS === 'ios' ? iosOptions : androidOption

        await Share.open(option)
          .then((res) => { console.log(res) })
          .catch((err) => { err && console.log('SHARE ERROR -> ',err); });
        // remove the image or pdf from device's storage
        // await RNFS.unlink(filePath);
      })
      .catch((err) => { err && console.log('BLOB ERROR -> ',err); });
  }

  const downloadFile =(fileUrl) => {
    const url = fileUrl;
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
          .catch((err) => console.log('SHARE ERROR -> ',err));
      }
    })
    .catch((err) => console.log('BLOB ERROR -> ', err));

  }

  const downloadData = () => {
    // write the file
    var iosPath = RNFS.DownloadDirectoryPath + '/sampleNew.pdf';
    var path = RNFS.ExternalStorageDirectoryPath +'/Download' + '/sampleNew.pdf';
    RNFS.writeFile(path, pdfData, 'base64')
      .then(async () => {
        console.log('FILE WRITTEN! IN STORAGE');
        if (Platform.OS === 'ios') {
          let options = {
            type: 'application/pdf',
            url: iosPath,
            saveToFiles: true,
          };
          await Share.open(options)
            .then((resp) => console.log(resp))
            .catch((err) => console.log('SHARE ERROR -> ',err));
        } else {
          console.log('FILE WRITTEN! IN Android Downlaods STORAGE');
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
        <View>
          <Button title ="Download PDF" onPress={()=> {downloadFile("https://www.africau.edu/images/default/sample.pdf")}}></Button>
          <Button title ="Share PDF " onPress={() => {sharePDF("https://www.africau.edu/images/default/sample.pdf",'application/pdf')}}></Button>
          <Button title= "Downlaod data" onPress={ downloadData}></Button>
        </View>
    </SafeAreaView>
  );
};

export default App;
