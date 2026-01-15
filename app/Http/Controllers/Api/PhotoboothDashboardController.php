<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PhotoboothSession;

class PhotoboothDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $sessions = PhotoboothSession::where('user_id', $user->id)
            ->where('status', 'completed')
            ->latest()
            ->take(3)
            ->get();

        $results = $sessions->map(function ($session) {
            $path = "photobooth/strips/strip-{$session->id}.jpg";

            return [
                'session_id' => $session->id,
                'strip_url' => asset('storage/' . $path),
            ];
        });

        return response()->json($results);
    }
}
