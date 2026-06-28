import { Document, Types } from 'mongoose';
export declare class WeatherAlert extends Document {
    userId: Types.ObjectId;
    city: string;
    alertType: string;
    temperature: number;
    description: string;
    severity: string;
    sent: boolean;
    sentAt?: Date;
    telegramMessageId?: string;
    active: boolean;
}
export declare const WeatherAlertSchema: import("mongoose").Schema<WeatherAlert, import("mongoose").Model<WeatherAlert, any, any, any, any, any, WeatherAlert>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WeatherAlert, Document<unknown, {}, WeatherAlert, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    city?: import("mongoose").SchemaDefinitionProperty<string, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    alertType?: import("mongoose").SchemaDefinitionProperty<string, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    temperature?: import("mongoose").SchemaDefinitionProperty<number, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    severity?: import("mongoose").SchemaDefinitionProperty<string, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sent?: import("mongoose").SchemaDefinitionProperty<boolean, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sentAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    telegramMessageId?: import("mongoose").SchemaDefinitionProperty<string | undefined, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    active?: import("mongoose").SchemaDefinitionProperty<boolean, WeatherAlert, Document<unknown, {}, WeatherAlert, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherAlert & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, WeatherAlert>;
