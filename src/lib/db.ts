import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / Bangladesh ISP DNS SRV resolution querySrv ECONNREFUSED
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e);
}

const DEFAULT_SRV_URI = 'mongodb+srv://regardstechteam_db_user:9HeoM5tmMn1pvW7b@regardstech.7roewfk.mongodb.net/businessideazone?retryWrites=true&w=majority&appName=RegardsTech';
const DIRECT_MONGODB_URI = 'mongodb://regardstechteam_db_user:9HeoM5tmMn1pvW7b@ac-vem00v3-shard-00-00.7roewfk.mongodb.net:27017,ac-vem00v3-shard-00-01.7roewfk.mongodb.net:27017,ac-vem00v3-shard-00-02.7roewfk.mongodb.net:27017/businessideazone?ssl=true&replicaSet=atlas-6r0tvw-shard-0&authSource=admin&retryWrites=true&w=majority';

const MONGODB_URI = (
  process.env.MONGODB_URI ||
  DIRECT_MONGODB_URI
).replace(/^MONGODB_URI=/, '').trim();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('MongoDB connected successfully (BusinessBondhu)');
        return m;
      })
      .catch(async (err) => {
        console.warn('Initial MongoDB connection error, attempting direct shard connection fallback:', err.message);
        if (MONGODB_URI !== DIRECT_MONGODB_URI) {
          try {
            const m = await mongoose.connect(DIRECT_MONGODB_URI, opts);
            console.log('MongoDB connected successfully via direct shard fallback (BusinessBondhu)');
            return m;
          } catch (fallbackErr: any) {
            console.error('Direct fallback connection error:', fallbackErr.message);
          }
        }
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

