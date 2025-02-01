import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

interface HealthFeedbackType {
  text: string;
  symptoms: string[];
  possibleReasons: string[];
  remedies: string[];
  professionalHelpRecommendation: string;
}

interface NearbyPlace {
  name: string;
  vicinity: string;
  distance: string;
  place_id: string;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyCDMbx9ihs6XzvgYDXejQfy8Vg8E8fgklk";

const declaration: FunctionDeclaration = {
  name: "generate_health_report",
  description:
    "Generates a health report based on symptoms and follow-up questions",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      text: {
        type: SchemaType.STRING,
        description: "Detailed description of the user's symptoms",
      },
      symptoms: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Symptoms experienced by the user",
      },
      possibleReasons: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Possible causes of the symptoms",
      },
      remedies: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Remedies or actions to alleviate the symptoms",
      },
      professionalHelpRecommendation: {
        type: SchemaType.STRING,
        description: "Whether professional medical help is recommended",
      },
    },
    required: [
      "text",
      "symptoms",
      "possibleReasons",
      "remedies",
      "professionalHelpRecommendation",
    ],
  },
};

function HealthAssistantComponent() {
  const navigate = useNavigate();
  const [isConsultationActive, setIsConsultationActive] = useState(false);
  const [healthFeedback, setHealthFeedback] =
    useState<HealthFeedbackType | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const [distanceService, setDistanceService] =
    useState<google.maps.DistanceMatrixService | null>(null);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { client, setConfig, disconnect } = useLiveAPIContext();

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const mapDiv = document.createElement("div");
        const map = new google.maps.Map(mapDiv, {
          center: { lat: 0, lng: 0 },
          zoom: 1,
        });

        setPlacesService(new google.maps.places.PlacesService(map));
        setDistanceService(new google.maps.DistanceMatrixService());
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

 const findNearbyMedicalShops = useCallback(async () => {
   if (!userLocation || !placesService || !distanceService) {
     setLocationError("Required services are not available. Please try again.");
     return;
   }

   setIsLoadingPlaces(true);
   try {
     const location = new google.maps.LatLng(
       userLocation.lat,
       userLocation.lng
     );

     const placesResult = await new Promise<google.maps.places.PlaceResult[]>(
       (resolve, reject) => {
         placesService.nearbySearch(
           {
             location,
             radius: 5000,
             type: "pharmacy",
           },
           (results, status) => {
             if (
               status === google.maps.places.PlacesServiceStatus.OK &&
               results
             ) {
               resolve(results);
             } else {
               reject(new Error("Places search failed"));
             }
           }
         );
       }
     );

     const topPlaces = placesResult.slice(0, 5);
     const destinations = topPlaces.map((place) => ({
       lat: place.geometry!.location!.lat(),
       lng: place.geometry!.location!.lng(),
     }));

     const distanceMatrix =
       await new Promise<google.maps.DistanceMatrixResponse>(
         (resolve, reject) => {
           distanceService.getDistanceMatrix(
             {
               origins: [userLocation],
               destinations,
               travelMode: google.maps.TravelMode.DRIVING,
             },
             (response, status) => {
               if (status === "OK" && response) {
                 resolve(response);
               } else {
                 reject(new Error("Distance calculation failed"));
               }
             }
           );
         }
       );

     const places: NearbyPlace[] = topPlaces.map((place, index) => ({
       name: place.name || "Unknown Place",
       vicinity: place.vicinity || "No address available",
       distance: distanceMatrix.rows[0].elements[index].distance.text,
       place_id: place.place_id || "",
     }));

     setNearbyPlaces(places);
   } catch (error) {
     console.error("Error fetching nearby places:", error);
     setLocationError(
       "Failed to fetch nearby medical shops. Please try again."
     );
   } finally {
     setIsLoadingPlaces(false);
   }
 }, [userLocation, placesService, distanceService]);

  const handleDisconnect = useCallback(() => {
    setIsDisconnecting(true);
    disconnect();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [disconnect, navigate]);

  const requestLocationPermission = useCallback(async () => {
    try {
      setLocationError(null);

      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch (error: any) {
      console.error("Detailed location error:", error);
      let errorMessage = "Unable to get your location. ";

      if (error.code === 1) {
        errorMessage +=
          "Please enable location access in your browser settings.";
      } else if (error.code === 2) {
        errorMessage += "Position unavailable. Please try again.";
      } else if (error.code === 3) {
        errorMessage += "Request timed out. Please try again.";
      } else {
        errorMessage += error.message || "Unknown error occurred.";
      }

      setLocationError(errorMessage);
      setUserLocation(null);
    }
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  useEffect(() => {
    if (healthFeedback && userLocation) {
      findNearbyMedicalShops();
    }
  }, [healthFeedback, userLocation, findNearbyMedicalShops]);

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
      },
      systemInstruction: {
        parts: [
          {
            text: `You are a professional AI paramedic assistant. Your task is to evaluate the user's health symptoms, ask relevant follow-up questions, and provide an analysis with possible reasons for the symptoms, suggested remedies, and advice on whether professional medical help is needed.

FOLLOW-UP QUESTIONS:
1. Ask the user for detailed information about their symptoms first.
2. After receiving the user's input, ask follow-up questions to clarify the symptoms, duration, and intensity.
3. Based on the user's responses, generate a report that includes possible reasons, remedies, and a recommendation for professional help if necessary.`,
          },
        ],
      },
      tools: [{ functionDeclarations: [declaration] }],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name
      );
      if (fc) {
        const args = fc.args as HealthFeedbackType;
        setHealthFeedback(args);
        setIsConsultationActive(false);
      }

      if (toolCall.functionCalls.length) {
        setTimeout(
          () =>
            client.sendToolResponse({
              functionResponses: toolCall.functionCalls.map((fc) => ({
                response: { output: { success: true } },
                id: fc.id,
              })),
            }),
          200
        );
      }
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const handleRetryLocation = () => {
    requestLocationPermission();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">AI Paramedic Assistant</h2>
          <div className="flex items-center gap-4">
            {isConsultationActive && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Consultation in Progress
              </span>
            )}
            <button
              onClick={handleDisconnect}
              className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
            >
              End Consultation
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          Please share the details of your symptoms, and I will provide a health
          report.
        </p>
        {isDisconnecting && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mt-4">
            Disconnecting from the consultation session...
          </div>
        )}
      </div>

      {healthFeedback && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Health Report</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">{healthFeedback.text}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-green-700 mb-3">
                  Possible Causes
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {healthFeedback.possibleReasons.map((reason, idx) => (
                    <li key={idx} className="text-gray-700">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-orange-700 mb-3">
                  Suggested Remedies
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {healthFeedback.remedies.map((remedy, idx) => (
                    <li key={idx} className="text-gray-700">
                      {remedy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-red-700 mb-3">
                Professional Help Recommendation
              </h3>
              <p className="text-gray-700">
                {healthFeedback.professionalHelpRecommendation}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-blue-700 mb-3">
                Nearby Medical Shops
              </h3>

              {locationError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 mb-2">{locationError}</p>
                  <button
                    onClick={handleRetryLocation}
                    className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                  >
                    Retry Location Access
                  </button>
                </div>
              ) : isLoadingPlaces ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">
                    Searching nearby medical shops...
                  </span>
                </div>
              ) : nearbyPlaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nearbyPlaces.map((place, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium text-gray-800">
                        {place.name}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {place.vicinity}
                      </p>
                      <p className="text-blue-600 text-sm mt-1">
                        Distance: {place.distance}
                      </p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          `${place.name} ${place.vicinity}`
                        )}&destination_place_id=${place.place_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        Get Directions
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  No nearby medical shops found. Please ensure location access
                  is enabled.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const MedSahayak = memo(HealthAssistantComponent);
