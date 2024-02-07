import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkEditProduct, thunkFetchMyProducts, thunkFetchOneProduct, thunkUpdateImage } from "../../redux/product";
import "./EditProductModal.css";
import { useNavigate } from "react-router-dom";

function EditProductModal({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { closeModal } = useModal();
  const [productName, setProductName] = useState(product.product_name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [inStock, setInStock] = useState(product.in_stock);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(product?.product_images[0]?.url);
  const [imageURL, setImageURL] = useState("")
  const [imageLoading, setImageLoading] = useState(false);



  const handleSubmit = e => {
    e.preventDefault()
    const errs = {}
    if(productName > 128) errs.productName = "Name must be less than 128 character"
    if(description > 350) errs.description = "Description must be less than 350 character"
    if (!productName) errs.productName = "Please include a name for your 'mallow"
    if (!description) errs.description = "Please include a description for your 'mallow"
    if (!price) errs.price = "Please set a price for your 'mallow"
    if (!image) {
      errs.image = "Please upload an image to create a new 'mallow"
      // setErrors(errs)
      // return errors
    }

    if (Object.keys(errs).length) {
      setErrors(errs)
      return errors
    }
    const body = {
      product_name: productName,
      description,
      price,
      in_stock: inStock
    }

    if(image !== product.product_images[0].url) {
      const formData = new FormData()
      formData.append("image", image)
      setImageLoading(true)

      dispatch(thunkUpdateImage(product, product.product_images[0].id, formData))
      // closeModal()
      // location.pathname = "/my-products"
      // location.pathname = "/"
    }

    dispatch(thunkEditProduct(product.id, body, ok => {
      if(ok) return closeModal()
      setErrors(errors)
  }))
  dispatch(thunkFetchOneProduct(product.id))
  }

  const fileWrap = (e) => {
    e.stopPropagation();

    const tempFile = e.target.files[0];

    // Check for max image size of 5Mb
    if (tempFile.size > 5000000) {
      setFilename(maxFileError); // "Selected image exceeds the maximum file size of 5Mb"
      return
    }

    const newImageURL = URL.createObjectURL(tempFile); // Generate a local URL to render the image file inside of the <img> tag.
    setImageURL(newImageURL);
    // setFile(tempFile);
    // setFilename(tempFile.name);
    // setOptional("");
  }

  return (
    <>
      <div id="editModalTitle">Edit your 'mallow</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div id="uploadImgContainer">
          Upload an image of your 'mallow
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              fileWrap(e);
              setImage(e.target.files[0])
            }}
          />
          <label htmlFor="fileUpload" className="imgUpload">
            Choose File
          </label>
          <span className="form-errors">{errors.image}</span>
          <div id="thumbnailContainer">
          {/* {imageURL && <img src={imageURL} alt="thumbnail" id="thumbnailImg" />} */}
          {(() => {
            if (!imageURL) {
              return <img src={image} alt="thumbnail" id="thumbnailImg" />
            } else {
              return <img src={imageURL} alt="thumbnail" id="thumbnailImg" />
            }
          })()}
          {/* {!imageURL && <div id="noThumbnail">No file chosen</div> } */}
          {/* <span id="fileName">{file.name ? file.name : "No file chosen"}</span> */}
          {/* <div className="form-errors">
            {errors.image}
          </div> */}
          </div>
        </div>
        <div id="nameInputContainer">
          <label htmlFor="productName">
            Name
          </label>
          <input
            type="text"
            name="productName"
            value={productName}
            placeholder="What's your `malllow's name?"
            onChange={(e) => setProductName(e.target.value)}
          />
          <div className="form-errors">
            {errors.productName}
          </div>
        </div>
        <div id="descInputContainer">
          <label htmlFor="desc">
            Description
          </label>
          <textarea
            name="desc"
            value={description}
            placeholder="Describe your 'mallow"
            rows="7"
            cols="50"
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="form-errors">
            {errors.description}
          </div>
        </div>
        <div id="priceInputContainer">
          <label htmlFor="price">
            Price
          </label>
          <span id="dollarSpan">$</span>
          <input
            type="number"
            name="price"
            placeholder="Enter value in USD"
            value={price}
            step=".01"
            onChange={(e) => setPrice(e.target.value)}
          />
          <div className="form-errors">
            {errors.price}
          </div>
        </div>
        <div>
        <label htmlFor="inStock">
          In stock?
        </label>
        <input
        type="checkbox"
        checked={inStock}
        onClick={(e) => setInStock(!inStock)}
        />
        </div>
        <br />
        <div id="submitModalBtns">
          <div id="cancelBtn" onClick={closeModal}>Cancel</div>
          <button type="submit">Submit</button>
          {(imageLoading) && <p>Loading...</p>}
        </div>
      </form>
    </>
  )
}

export default EditProductModal;
