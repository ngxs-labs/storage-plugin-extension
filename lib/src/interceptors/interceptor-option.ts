export interface InterceptorOption {
    /**
     * Key to serialize/deserialize.
     */
    key?: string;

    /**
     * Method to call before serialization.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onBeforeSerialize?: (obj: any) => any;

    /**
     * Method to call after deserialization.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAfterDeserialize?: (obj: any) => any;
}
