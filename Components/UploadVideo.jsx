import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';

const UploadBtn = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleUpload = async () => {
    console.log('Uploading to YouTube');
   
  };

  return (
    <View>
      <Button onPress={handleUpload} title={isUploading ? 'Uploading...' : 'Upload to YouTube'} disabled={isUploading} />
      {uploadStatus ? <Text>{uploadStatus}</Text> : null}
    </View>
  );
};

export default UploadBtn;
