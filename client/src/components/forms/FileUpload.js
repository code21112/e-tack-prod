import React, { useState, useEffect } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Row, Col, Badge } from "antd";

import { LoadingOutlined } from "@ant-design/icons";

const FileUpload = ({
  values,
  setValues,
  setLoading,
  imagesSent,
  setImagesSent,
  newUploadedImages,
  setNewUploadedImages,
  updatingImages,
}) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [cursorOption, setCursorOption] = useState("pointer");
  const [loader, setLoader] = useState(false);
  // const [imagesToUpload, setImagesToUpload] = useState([]);
  const [imagesAlreadyUploaded, setImagesAlreadyUploaded] = useState(false);

  // useEffect(() => {
  //   setValues({ ...values, imagesToUpload: [] });
  // }, []);

  const fileUploadAndResize = async (e) => {
    console.log("e.target.files", e.target.files);
    // Resize the image(s)
    let files = e.target.files;
    let uploadedImages;
    let imagesToUpload = [];
    // if (imagesSent) {
    //   uploadedImages = [];
    // } else if (imagesToUpload.length === 0) {
    //   uploadedImages = values.images;
    // } else {
    //   imagesToUpload.push(files);
    // }

    if (imagesSent && updatingImages) {
      uploadedImages = values.images;
    } else if (imagesSent && !updatingImages) {
      uploadedImages = [];
      setImagesSent(false);
    } else if (!imagesSent && imagesAlreadyUploaded) {
      uploadedImages = values.images;
      setImagesSent(false);
    }
    setLoader(true);

    if (files) {
      setLoading(true);
      setImagesAlreadyUploaded(true);
      for (let i = 0; i < files.length; i++) {
        // console.log("files[i].name", files[i].name);
        await Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            // console.log("uri", uri);
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                {
                  images: uri,
                },
                {
                  headers: {
                    authtoken: user ? user.token : "",
                  },
                }
              )
              .then((res) => {
                console.log("Image upload res", res);
                console.log("imagesToUpload", imagesToUpload);
                console.log("imagesToUpload.length", imagesToUpload.length);

                console.log("uploadedImages", uploadedImages);

                setLoading(false);
                setLoader(false);
                uploadedImages.push(res.data);
                imagesToUpload.push(res.data);
                // setNewUploadedImages(imagesToUpload);
                setNewUploadedImages(uploadedImages);
                if (!updatingImages) {
                  setValues({
                    ...values,
                    images: uploadedImages,
                  });
                }
              })
              .catch((err) => {
                console.log("CLOUDINARY UPLOAD ERROR", err);
                setLoading(false);
                setLoader(false);
              });
          }
        );
      }
    }
    // Send to backend to upload to Cloudinary
    // Set url to the array images in the parent component (ProductCreate)
  };

  const handleImageRemove = (id) => {
    setLoading(true);
    setCursorOption("wait");
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id: id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setLoading(false);
        setCursorOption("pointer");
        const { images } = values;
        let filteredImages = images.filter((item) => {
          return item.public_id !== id;
        });
        // setValues({ ...values, uploadedImages: filteredImages });
        // setUploadedImages(filteredImages);
        setNewUploadedImages(filteredImages);
        setValues({ ...values, images: filteredImages });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setCursorOption("pointer");
      });
  };

  return (
    <>
      <div className="row">
        {JSON.stringify(imagesSent)}
        <br />
        {JSON.stringify(updatingImages)}

        {/* {!sent && loader ? (
          <Row>
            <Col span={12} offset={10}>
              <LoadingOutlined className="h1" />
            </Col>
          </Row>
        ) : (
          <Row>
            {values.images &&
              values.images.map((image) => (
                // console.log("image within .map", image)
                <Col span={4}>
                  <span className="avatar-item">
                    <Badge
                      count="X"
                      key={image.public_id}
                      onClick={() => handleImageRemove(image.public_id)}
                      style={{ cursor: cursorOption }}
                    >
                      <Avatar
                        size={70}
                        src={image.url}
                        className="mt-1 mb-2 ml-2 mr-2"
                        shape="square"
                      />
                    </Badge>
                  </span>
                </Col>
              ))}
          </Row>
        )} */}

        {!imagesSent && loader && (
          <Row>
            <Col span={12} offset={10}>
              <LoadingOutlined className="h1" />
            </Col>
          </Row>
        )}
        {!imagesSent && !loader && (
          <Row>
            {newUploadedImages &&
              newUploadedImages.map((image) => (
                // console.log("image within .map", image)
                <Col span={4} key={image.public_id}>
                  <span className="avatar-item">
                    <Badge
                      count="X"
                      onClick={() => handleImageRemove(image.public_id)}
                      style={{ cursor: cursorOption }}
                    >
                      <Avatar
                        size={70}
                        src={image.url}
                        className="mt-1 mb-2 ml-2 mr-2"
                        shape="square"
                      />
                    </Badge>
                  </span>
                </Col>
              ))}
          </Row>
        )}
        {imagesSent && updatingImages && !loader && (
          <Row>
            {newUploadedImages &&
              newUploadedImages.map((image) => (
                // console.log("image within .map", image)
                <Col span={4} key={image.public_id}>
                  <span className="avatar-item">
                    <Badge
                      count="X"
                      onClick={() => handleImageRemove(image.public_id)}
                      style={{ cursor: cursorOption }}
                    >
                      <Avatar
                        size={70}
                        src={image.url}
                        className="mt-1 mb-2 ml-2 mr-2"
                        shape="square"
                      />
                    </Badge>
                  </span>
                </Col>
              ))}
          </Row>
        )}
      </div>

      <div className="row">
        <label className="btn btn-primary btn-raised">
          Picture(s)
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
