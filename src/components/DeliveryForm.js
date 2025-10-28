import React, { useEffect, useState } from "react";
import "./DeliveryForm.css"; // link to CSS file
import { get, post } from "../utility/fetch";
import { useParams, useSearchParams } from "react-router-dom";
import DeliveryFormDrugsTable from "./DeliveryFormDrugsTable";
import DeliveryFormBabyVital from "./DeliveryFormBabyVital";
import DeliveryFormMotherVital from "./DeliveryFormMotherVital";
import toast from "react-hot-toast";

const DeliveryForm = () => {
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatmentId");
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  const { patientId } = useParams();
  const [deliveryData, setDeliveryData] = useState(null);
  const [watcher, setwatcher] = useState(null);

  const [formData, setFormData] = useState({
    patientId: 0,
    antenatalId: +treatmentId,
    deliveryDate: "",
    deliveryTime: {},
    modeOfDelivery: 1,
    deliveryBabyCry: 1,
    apgarScore: "",
    sex: "",
    weight: 0,
    durationOfLabour: {},
    placentaDelivery: {
      deliveryTime: {},
      deliveryMode: 1,
      complete: true,
    },
    anyPPH: false,
    episiotomyGiven: false,
    perineal: 0,
    appointmentId: 0,
    doctorId: 0,
    nurseId: 0,
  });

  useEffect(() => {
    getDeliveryRecords();
  }, [watcher]);

  const getDeliveryRecords = async () => {
    const response = await get(
      `/AntenatalDelivery/antenatalDelivery/${treatmentId}`
    );
    console.log(response.data);
    // setFormData({...formData, ...response?.data});

    if (response.isSuccess) {
    setFormData({...formData, ...response?.data});
      setDeliveryData(response.data || null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("placentaDelivery.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        placentaDelivery: {
          ...prev.placentaDelivery,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    console.log("Form submitted:", formData);

    let payload = {
      ...formData,
      antenatalId: +treatmentId,
      patientId: +patientId,
      appointmentId: +localStorage.getItem("appointmentId"),
      doctorId: docInfo?.employeeId,
      weight: +formData?.weight,
      perineal: +formData?.perineal,
      deliveryBabyCry: +formData?.deliveryBabyCry,
      modeOfDelivery: +formData?.modeOfDelivery,
      placentaDelivery: {
        ...formData?.placentaDelivery,
        deliveryMode: +formData?.placentaDelivery?.deliveryMode,
      },
      // formData?.placentaDelivery.deliveryMode
    };

    console.log(payload);
    // return;

    const response = await post(
      `/AntenatalDelivery`,
      { ...payload } // send formData directly
    );

    console.log(response);
    if (response?.isSuccess) {
      toast.success(response.data.message||'Successful');
      getDeliveryRecords();
    } else {
      toast.error(response.data.message || "Somethingwent wrong");
    }
  };

  return (
    <div className="section-box">
      <h2>Delivery Record Form</h2>

      <div className="form-grid">
        <div className="field-column">
          <label>
            Delivery Date
            <input
              type="datetime-local"
              name="deliveryDate"
              value={formData?.deliveryDate}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* <div className="field-column">
          <label>
            Delivery Time
            <input
              type="time"
              name="deliveryTime"
              value={formData.deliveryTime}
              // onChange={handleChange}
            />
          </label>
        </div> */}

        <div className="field-column">
          <label>Mode of Delivery</label>
          <select
            name="modeOfDelivery"
            className="input-field"
            value={formData?.modeOfDelivery}
            onChange={handleChange}
            // onChange={(e) => handleChange(e, ["birthPlan", "modeOfDelivery"])}
          >
            <option value="">--Select--</option>
            <option value={1}>Vaginal</option>
            <option value={2}>Cesarean - elective</option>
            <option value={3}>Assisted - emergency</option>
            <option value={4}>Trial of labour</option>
            <option value={5}>VBAC</option>
          </select>
        </div>

        {/* <div className="field-column">
          <label>
            Mode of Delivery
            <input
              type="number"
              name="modeOfDelivery"
              value={formData?.modeOfDelivery}
              onChange={handleChange}
            />
          </label>
        </div> */}

        <div className="field-column">
          <label>Baby Cry</label>

          <select
            name="deliveryBabyCry"
            onChange={handleChange}
            className="input-field"
            value={formData?.deliveryBabyCry}
          >
            <option value="">Select…</option>
            <option value="1">Good</option>
            <option value="2">Absent</option>
            <option value="3">Weak</option>
          </select>
        </div>

        {/* <div className="field-column">
          <label>
            <input
              type="number"
              name="deliveryBabyCry"
              value={formData?.deliveryBabyCry}
              onChange={handleChange}
            />
          </label>
        </div> */}

        <div className="field-column">
          <label>
            Apgar Score
            <input
              type="text"
              name="apgarScore"
              value={formData?.apgarScore}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="field-column">
          <label>
            Sex
            <select
              name="sex"
              className="input-field"
              value={formData?.sex}
              onChange={handleChange}
              // onChange={(e) => handleChange(e, ["birthPlan", "modeOfDelivery"])}
            >
              <option value="">--Select--</option>
              <option value={"Male"}>Male</option>
              <option value={"Female"}>Female</option>
            </select>
            {/* <input
              type="text"
              name="sex"
              value={formData?.sex}
              onChange={handleChange}
            /> */}
          </label>
        </div>

        <div className="field-column">
          <label>
            Weight (kg)
            <input
              type="number"
              name="weight"
              value={formData?.weight}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* <div className="field-column">
          <label>
            Duration of Labour
            <input
              type="text"
              name="durationOfLabour"
              value={formData?.durationOfLabour}
              // onChange={handleChange}
            />
          </label>
        </div> */}

        <div className="field-column">
          <label>
            Perineal
            <input
              type="number"
              name="perineal"
              value={formData?.perineal}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="field-column">
          <label>
            Any PPH
            <input
              type="checkbox"
              name="anyPPH"
              checked={formData?.anyPPH}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="field-column">
          <label>
            <input
              type="checkbox"
              name="episiotomyGiven"
              checked={formData?.episiotomyGiven}
              onChange={handleChange}
            />
            Episiotomy Given
          </label>
        </div>
      </div>

      <fieldset>
        <legend>Placenta Delivery</legend>
        <div className="form-grid">
          {/* <div className="field-column">
            <label>
              Delivery Time
              <input
                type="time"
                name="placentaDelivery.deliveryTime"
                value={formData?.placentaDelivery.deliveryTime}
                // onChange={handleChange}
              />
            </label>
          </div> */}

          <div className="field-column">
            <label>
              Delivery Mode
              <select
                name="placentaDelivery.deliveryMode"
                className="input-field"
                value={formData?.placentaDelivery?.deliveryMode}
                onChange={handleChange}
                // onChange={(e) => handleChange(e, ["birthPlan", "modeOfDelivery"])}
              >
                <option value="">--Select--</option>
                <option value={1}>Vaginal</option>
                <option value={2}>Cesarean - elective</option>
                <option value={3}>Assisted - emergency</option>
                <option value={4}>Trial of labour</option>
                <option value={5}>VBAC</option>
              </select>
              {/* <input
                type="number"
                name="placentaDelivery.deliveryMode"
                value={formData?.placentaDelivery.deliveryMode}
                onChange={handleChange}
              /> */}
            </label>
          </div>

          <div className="field-column">
            <label>
              <input
                type="checkbox"
                name="placentaDelivery.complete"
                checked={formData?.placentaDelivery?.complete}
                onChange={handleChange}
              />
              Complete
            </label>
          </div>
        </div>
      </fieldset>

      {!deliveryData && <button onClick={handleSubmit}>Submit</button>}

      {deliveryData && (
        <div>
          <DeliveryFormDrugsTable
            deliveryData={deliveryData}
            setwatcher={setwatcher}
            // tableData ={deliveryData?.drugsGiven||[]}
          />
          <DeliveryFormBabyVital
            deliveryData={deliveryData}
            setwatcher={setwatcher}
            // tableData ={deliveryData?.drugsGiven||[]}
          />
          <DeliveryFormMotherVital
            deliveryData={deliveryData}
            setwatcher={setwatcher}
            // tableData ={deliveryData?.drugsGiven||[]}
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;
