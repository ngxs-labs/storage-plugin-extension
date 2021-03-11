export interface InterceptorOption {
    /**
     * Key to serialize/deserialize.
     */
    key?: string;

    /**
     * Method to call before serialization.
     */
    onBeforeSerialize?: (obj: any) => any;

    /**
     * Method to call after deserialization.
     */
    onAfterDeserialize?: (obj: any) => any;
}
